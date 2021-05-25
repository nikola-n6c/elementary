const core = require('elementary-core');
const el = require('@nick-thompson/elementary');


// This example is a quick exercise in unison for a polyblep sawtooth synth voice.
//
// To start, we construct a synth voice function here which takes a frequency value, `freq`,
// at which to run the oscillators, and a `delta` value which can be thought of as a "spread"
// parameter for voice unison. We then construct and return an array of 7 sawtooth voices running
// in parallel, each randomly distributed between [freq, freq + delta].
function voice(freq, delta) {
  return el.mul(
    el.const({value: 1.0 / 7.0}),
    el.add(
      el.blepsaw(el.const({value: freq + delta * Math.random()})),
      el.blepsaw(el.const({value: freq + delta * Math.random()})),
      el.blepsaw(el.const({value: freq + delta * Math.random()})),
      el.blepsaw(el.const({value: freq + delta * Math.random()})),
      el.blepsaw(el.const({value: freq + delta * Math.random()})),
      el.blepsaw(el.const({value: freq + delta * Math.random()})),
      el.blepsaw(el.const({value: freq + delta * Math.random()})),
    )
  );
}

// Here, because more is just better (right?), we extend the above voice into
// a bigger "superVoice," which adds four "voice" instances together, yielding
// a single sawtooth voice with 28 unison voices all playing around the given
// frequency.
function superVoice(freq, delta) {
  return el.mul(
    el.const({value: 1.0 / 4.0}),
    el.add(
      voice(freq, delta),
      voice(freq, delta),
      voice(freq, delta),
      voice(freq, delta),
    )
  )
}

// Await the load event, and kick it off!
//
// Out of curiousity I've added here a brief high resolution time measurement around
// the call to render. To render this structure we're constructing and then reconciling
// a much larger signal graph than in either of the previous examples, so here's an interesting
// opportunity to measure.
core.on('load', function() {
  const time = process.hrtime();
  core.render(superVoice(110, 8.0), superVoice(110, 8.0));
  const diff = process.hrtime(time);
  const nanos = diff[0] * 1e9 + diff[1];
  const ms = nanos / 1e6;
  console.log(`Initial render took ${ms}ms`);
});
