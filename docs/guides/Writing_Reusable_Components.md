# Writing Reusable Components

In [Native Rendering](./Native_Rendering.md) we touched on the idea of primitive signal
nodes and the abstractions we can form around those primitives nodes. Here we're going
to revisit that conversation in more detail, and introduce the idea of a composite signal
node. Let's start again with this idea:

> A primitive signal node is one understood by the underlying native rendering engine in Elementary. All other
library functions ultimately decay to primitive signals.

Suppose that we want to write something that looks like this:

```js
core.render(el.sub(el.phasor(440), 0.5));
```

This is a contrived example which shows the construction of a naive sawtooth waveform at
440Hz with an amplitude of 0.5. Here, both `el.sub` and `el.phasor` are primitive nodes, which means
that after Elementary has completed the render, the realtime engine will be operating with the
same idea of an `el.sub` node and an `el.phasor` node.

Suppose now that we wanted to make our naive sawtooth waveform into a more reusable abstraction.
One simple way we could do that is to just make a plain old function:

```js
function saw(frequency) {
  return el.sub(el.phasor(frequency), 0.5);
}

core.render(saw(440));
```

Here we can see that the arguments we're passing to `core.render` are identical to the ones
passed in the prior example, because invoking our `saw` function with `440` yields the same
structure. This way of abstraction over primitive nodes works well, and is a pattern you can use
freely when building applications in Elementary. But there's another way of accomplishing a similar
feat which allows Elementary an opportunity to sneak in some helpful rendering tactics.

Let's expand on our `saw` function to make what I call a supersaw: a big mess of detuned sawtooth
oscillators all playing at once (an awesome starting point for subtractive synthesis):

```js
// Here, `frequency` will be the the frequency we're aiming to play, `spread` controls
// the extent of the detuning in Hz, and voices tells how many saws we'll use to create
// our detuned supersaw.
function supersaw(frequency, spread, voices) {
  let saws = [];

  for (let i = 0; i < voices; ++i) {
    let detune = (i / voices) * spread;
    saws.push(el.sub(el.phasor(frequency + detune), 0.5));
  }

  return el.add(saws);
}

core.render(supersaw(440, 10, 6));
```

You can see in this example that we're using the same form of abstraction, and therefore
`core.render` sees a structure which has already completely decayed to primitive nodes.
This time, our node structure is significantly bigger than the former example. Let's add a little
more here to filter our supersaw with an imaginary user-controlled cutoff frequency:

```js
core.render(el.lowpass(userCutoff, 0.717, supersaw(440, 10, 6)));

// Now let's imagine a hypothetical callback which will be invoked when the
// user manipulates the cutoff frequency:
function onCutoffChange(newCutoffValue) {
  // And let's assume here that `newCutoffValue` is of type `number`
  core.render(el.lowpass(newCutoffValue, 0.717, supersaw(440, 10, 6)));
}
```

Now we have an interesting situation. First, remember from [Understanding Keys](./Understanding_Keys.md)
the way that Elementary reconciles the new structure with the old. If we change the cutoff frequency of
our lowpass filter in response to a user interaction in this way, Elementary will understand this as
describing a completely new filter (which in a real application we would address with a `key` prop,
but here it helps our example). Notice, though, before `core.render()` even sees this new structure,
we've already evaluated `supersaw` and built that whole substructure. Elementary in turn will traverse
this whole substructure before ultimately recognizing that our supersaw hasn't changed, which feels like
a bunch of wasted effort! Here we can make this both faster and simpler by introducing a new type of
node: the composite node. Let's make a few small changes to our `supersaw` function:

```js
const supersaw = el.createNodeFactory(function __supersaw(props, frequency, spread, voices) {
  let saws = [];

  for (let i = 0; i < voices; ++i) {
    let detune = (i / voices) * spread;
    saws.push(el.sub(el.phasor(frequency + detune), 0.5));
  }

  return el.add(saws);
});
```

You should see two things: first, our `supersaw` function now takes a `props` argument, and second,
our `supersaw` is wrapped in `el.createNodeFactory`. With this, when we actually then invoke
the `supersaw` function, we receive a new Node which has not yet decayed to any primitives, it's simply
a Node which Elementary understands must still be resolved before it can complete its render. This is a
step that happens inside of `core.render` for any unresolved composite nodes, and this is also an opportunity
to help Elementary operate quickly: composite nodes offer a memoization step, which allows Elementary
to leave composite nodes unresolved during the render process when it realizes ahead of time that the
structure described by the composite node will not change in this render pass. Let's revisit our filter:

```js
// First we can write a helper function to decide whether `supersaw` needs to
// be evaluated again.
function compare(prevProps, prevChildren, nextProps, nextChildren) {
  // Our supersaw doesn't do anything with its props, so we can ignore that
  // here. The interesting thing will be `prevChildren` and `nextChildren`. Below,
  // you'll see that all of our calls to `supersaw` pass 440, 10, 6 as arguments.
  // We should therefore see `prevChildren` as an array holding `[440, 10, 6]`, and
  // the same for `nextChildren`. When that is indeed true, we can tell Elementary
  // "don't bother resolving the supersaw again: it's not going to change!"
  return prevChildren.length === nextChildren.length
    && prevChildren[0] === nextChildren[0]
    && prevChildren[1] === nextChildren[1]
    && prevChildren[2] === nextChildren[2];
}

// Because of `el.createNodeFactory`, we can now pass props to `supersaw`.
// This special property named `compare` will be invoked to attempt a memoization
core.render(el.lowpass(userCutoff, 0.717, supersaw({compare}, 440, 10, 6)));

function onCutoffChange(newCutoffValue) {
  core.render(el.lowpass(newCutoffValue, 0.717, supersaw({compare}, 440, 10, 6)));
}
```

Now we're using composite nodes to our benefit: any time the user changes the cutoff frequency
in this hypothetical example, we'll pass to `core.render` a small structure with an unresolved
`supersaw` composite node, and on all but the first render we can tell Elementary not to bother
resolving it again. This way, the amount of work to do inside of `core.render` is significantly limited,
at the benefit of your application's speed.

Besides this, `el.createNodeFactory` introduces the idea of `props` to your own graph nodes,
which can be a helpful way for structuring your application and passing relevant state throughout
your signal graph.
