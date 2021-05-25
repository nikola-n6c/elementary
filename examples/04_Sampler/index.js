const core = require('elementary-core');
const el = require('@nick-thompson/elementary');


// This example is a slight variation on the previous MIDI Synth example to
// show a simple MIDI enabled Sampler.
//
// To start, I've got a couple sample files on disk that I want to trigger
// with a MIDI keyboard. When running this example, you'll want to update
// these file paths to some sample files on your own disk.
const kick02 = '~/Music/Samples/Dairy Free/20191124/Toast/Kicks/Kick02.wav';
const hh02 = '~/Music/Samples/Dairy Free/20191124/Toast/Glitch/HH02.wav';
const clap01 = '~/Music/Samples/Dairy Free/20191124/Toast/Snares/Clap01.wav';
const contact04 = '~/Music/Samples/Dairy Free/20201205/Contact04.wav';
const contact05 = '~/Music/Samples/Dairy Free/20201205/Contact05.wav';
const contact08 = '~/Music/Samples/Dairy Free/20201205/Contact08.wav';

// Next we've got our initial voice data, and here we assign the above samples
// to the corresponding MIDI note numbers with which we want to trigger them
let voices = {
  '60': {gain: 1.0, gate: 0.0, path: kick02, key: 'v1'},
  '61': {gain: 1.0, gate: 0.0, path: hh02, key: 'v2'},
  '62': {gain: 0.6, gate: 0.0, path: clap01, key: 'v3'},
  '63': {gain: 1.0, gate: 0.0, path: contact04, key: 'v4'},
  '64': {gain: 1.0, gate: 0.0, path: contact05, key: 'v5'},
  '65': {gain: 1.0, gate: 0.0, path: contact08, key: 'v6'},
};

// Our voice state update function, quite similar to the MIDI Synth example,
// except that this time we don't need any form of round robin voice allocation–
// we know exactly which sample we want to trigger by which MIDI note based on
// the mapping above.
function updateVoiceState(e) {
  if (e && e.hasOwnProperty('type') && e.type === 'noteOn') {
    if (voices.hasOwnProperty(e.noteNumber)) {
      voices[e.noteNumber].gate = 1.0;
    }
  }

  if (e && e.hasOwnProperty('type') && e.type === 'noteOff') {
    if (voices.hasOwnProperty(e.noteNumber)) {
      voices[e.noteNumber].gate = 0.0;
    }
  }
}

// Then we have our sampler voice: simply multiplying the voice's gain by the
// output of `el.sample`.
//
// `el.sample` loads up a given file based on the `path` prop provided, and triggers
// that sample on the rising edge of a pulse signal (i.e. a transition from 0 to 1).
function samplerVoice(voice) {
  let gate = el.const({key: voice.key, value: voice.gate});
  return el.mul(voice.gain, el.sample({path: voice.path}, gate));
}

// Finally, much like the previous example, we install a "midi" event handler
// in which we update the voice state, recompute the output signal, and render
// it.
core.on('load', function() {
  core.on('midi', function(e) {
    updateVoiceState(e);

    let out = el.add(Object.keys(voices).map(function(n) {
      return samplerVoice(voices[n]);
    }));

    let filtered = el.lowpass(1800, 1.414, out);

    core.render(filtered, filtered);
  });
});
