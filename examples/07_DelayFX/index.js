const core = require('elementary-core');
const el = require('@nick-thompson/elementary');


// This example demonstrates input processing with Elementary, applying some
// simple delay effects to the microphone input.
//
// **BE AWARE THAT THIS MAY CAUSE A FEEDBACK LOOP IF YOUR MIC CAN HEAR YOUR SPEAKERS.**
// **HEADPHONES RECOMMENDED.**

// First, a simple helper function for essentially applying a sine shape LFO to a given
// value `x`, at the provided `rate` and `amount`.
function modulate(x, rate, amount) {
  return el.add(x, el.mul(amount, el.cycle(rate)));
}

// Here we have a very basic flanger, which just modulates a delay tap within
// 0.1ms to 7.9ms at a feedback of 0.9.
function flanger(x) {
  const sr = core.getSampleRate();
  const lfo = modulate(4, 0.1, 3.9);

  return el.delay({size: sr}, el.ms2samps(lfo), 0.9, x);
}

// And finally a simple wrapper around `el.delay` just to make the render
// step below a little easier to read.
function fbdelay(delayTime, x) {
  const sr = core.getSampleRate();

  return el.delay({size: sr}, el.ms2samps(delayTime), 0.6, x);
}

core.on('load', function() {
  console.log('Be careful. If your mic can hear your speakers, this will cause a feedback loop.');
  const sr = core.getSampleRate();

  // Our render step is a simple chain of the above fbdelay and flanger functions
  // with a little bit of stereo differentiation via the slightly offset delay times
  // and a lowpass in the left channel vs a highpass in the right.
  //
  // The choices here are of course arbitrary and lean on your own creative direction,
  // but this example aims to simply demonstrate some of what you can do with input
  // processing.
  core.render(
    flanger(el.lowpass(800, 1.414, fbdelay(500, el.in({channel: 0})))),
    flanger(el.highpass(800, 1.414, fbdelay(600, el.in({channel: 1})))),
  );
});
