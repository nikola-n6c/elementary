const core = require('elementary-core');
const el = require('@nick-thompson/elementary');
const path = require('path');


// In this example, we're building a simple MIDI-enabled polyphonic sawtooth
// synthesizer.
//
// To start, we assemble our initial 4-voice state.
let voices = [
  {gate: 0.0, freq: 440, key: 'v1'},
  {gate: 0.0, freq: 440, key: 'v2'},
  {gate: 0.0, freq: 440, key: 'v3'},
  {gate: 0.0, freq: 440, key: 'v4'},
];

// The nextVoice variable keeps track of an index into the `voices` array which
// is up next for allocation on the next `noteOn` MIDI event.
let nextVoice = 0;

// Here we have our state update function, which will be invoked on any incoming
// MIDI event.
//
// In the case that we receive a `noteOn` event, we allocate the `nextVoice` voice
// from our array above and assign the appropriate state, then increment our nextVoice index.
//
// In the case that we receive a `noteOff` event, we walk along the voices array looking
// for the voice which is already rendering the note frequency which we wish to silence.
// This is rather naive voice deallocation, but it works for our purposes!
function updateVoiceState(e) {
  if (e && e.hasOwnProperty('type') && e.type === 'noteOn') {
    voices[nextVoice].gate = 1.0;
    voices[nextVoice].freq = e.noteFrequency;

    if (++nextVoice >= voices.length)
      nextVoice -= voices.length;
  }

  if (e && e.hasOwnProperty('type') && e.type === 'noteOff') {
    for (let i = 0; i < voices.length; ++i) {
      if (voices[i].freq === e.noteFrequency) {
        voices[i].gate = 0;
      }
    }
  }
}

// Here we have our synth voice. Much like the previous examples, here we take
// one of the voice state objects from the array above and return a sawtooth
// oscillator with its own ADSR envelope applied.
//
// It's important here to use the `key` prop on the `el.const` nodes below to ensure
// that we avoid graph mutations on MIDI events. Check the "Understanding Keys" section
// of the docs to understand this piece in detail.
function synthVoice(voice) {
  let gate = el.const({key: `${voice.key}:gate`, value: 0.2 * voice.gate});
  let env = el.adsr(4.0, 1.0, 0.4, 2.0, gate);

  return el.mul(
    env,
    el.blepsaw(
      el.const({key: `${voice.key}:freq`, value: voice.freq})
    )
  );
}

// A simple helper function for essentially applying a sine shape LFO to a given
// value `x`, at the provided `rate` and `amount`.
function modulate(x, rate, amount) {
  return el.add(x, el.mul(amount, el.cycle(rate)));
}

// Here we await the "load" event as usual, but this time when the event fires we
// don't render yet– we install another event handler for "midi" events. When a new
// MIDI event comes in, we update the voice state, rebuild our signal, and render again.
core.on('load', function() {
  core.on('midi', function(e) {
    updateVoiceState(e);

    // Start with just a dry sum of all of our 4 sawtooth voices.
    let out = el.add(voices.map(synthVoice));

    // Then we'll apply a lowpass filter at 800Hz, with LFO modulation at 1.1Hz that sweeps
    // along [-400, 400], thereby modulating our lowpass cutoff between [400Hz, 1200Hz].
    let filtered = el.lowpass(modulate(800, 1.1, 400), 1.4, out);

    // Next we apply a little bit of feedback delay to the filtered signal to create some
    // space and movement.
    let delayed = el.delay({size: 44100}, el.ms2samps(500), 0.6, filtered);

    // Sum the delayed signal with the original.
    let wetdry = el.add(filtered, delayed);

    // Apply some convolution reverb to the prior `wetdry` signal.
    let reverbed = el.convolve({path: path.resolve(__dirname, './KnightsHall.wav')}, wetdry);

    // And finally sum the wet reverb signal with the `wetdry` signal from above.
    let wetdry2 = el.add(reverbed, wetdry);

    // Then we render the same `wetdry2` signal into both the left and the right channel,
    // though of course you can deviate from the above flow at any point to create interesting
    // stereo behavior by differentiating the left and the right channel signals.
    core.render(wetdry2, wetdry2);
  });
});
