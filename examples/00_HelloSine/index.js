const core = require('elementary-core');
const el = require('@nick-thompson/elementary');


// This example is the "Hello, world!" of writing audio processes in Elementary.
//
// To start, we await the "load" event, which is the point at which the Elementary
// runtime is prepared to start receiving render instructions. Then, we make a single
// call to `core.render` with two arguments. Each argument here is an instruction for
// what to render in the respective output channel, so with a stereo output pair, the first
// argument will render to the left channel, and the second argument will render to the right.
//
// The signal we're generating here is a simple sine tone via `el.cycle` at 440Hz in the left
// channel and 441Hz in the right, creating some interesting binaural beating. Each sine tone is
// then multiplied by 0.3 to apply some simple gain before going to the output. That's it!
core.on('load', function() {
  core.render(
    el.mul(0.3, el.cycle(440)),
    el.mul(0.3, el.cycle(441)),
  );
});
