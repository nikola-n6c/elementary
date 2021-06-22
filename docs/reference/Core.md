# Core

```js
require('elementary-core');
```

The `elementary-core` native module is primarily responsible for interfacing with the underlying
native audio runtime.

* [Events](#events)
    * ['load'](#load)
    * ['midi'](#midi)
    * ['tick'](#tick)
* [getSampleRate()](#getSampleRate)
* [getBlockSize()](#getBlockSize)
* [getNumInputChannels()](#getNumInputChannels)
* [getNumOutputChannels()](#getNumOutputChannels)
* [getQuantizationInterval()](#getQuantizationInterval)
* [render(...args)](#render)


## Events

The `elementary-core` module exports an object which is an instance of Node.js' `events.EventEmitter`. The events
below will be dispatched from the native module and can be subscribed to following the `EventEmitter` API.

#### 'load'

The load event fires when the runtime has finished preparing the audio rendering thread and is ready
to handle render calls.

#### 'midi'

The midi event fires any time the runtime receives a MIDI event from any connected and enabled device. By default,
the runtime will be listening to any such device, which may yield frequent MIDI events.

The `'midi'` event is fired with a single argument: an object describing the event.

```js
// A noteOn event
{
  bytes: '90456a',
  noteFrequency: 440,
  noteName: 'A3',
  noteNumber: 69,
  source: 'Moog Grandmother',
  type: 'noteOn'
}

// A noteOff event
{
  bytes: '80456a',
  noteFrequency: 440,
  noteName: 'A3',
  noteNumber: 69,
  source: 'Moog Grandmother',
  type: 'noteOff'
}

// A controller event
{
  bytes: 'b0082d',
  channel: 1,
  source: 'Moog Grandmother',
  target: 8,
  type: 'controller',
  value: 45
}
```

Note: all MIDI events are enumerated with at least a `source`, `type`, and `bytes` property. Events for which
the runtime could not derive a helpful type will show `type: "raw"`. The `bytes` property is a hexidecimal string
containing the raw MIDI payload for further deserialization in such cases.

Supported events:
- NoteOn
- NoteOff
- ProgramChange
- PitchWheel
- Aftertouch
- ChannelPressure
- AllNotesOff
- AllSoundOff
- MetaEvent
- Controller
- Raw

#### 'tick'

The tick event fires only when the quantize option is enabled. See [Command Line Options](../guides/Command_Line.md) for
more details on the quantize option. Specifically, the `'tick'` event will fire just after the runtime has finished applying
any queued changes at the end of a given quantization interval.

## getSampleRate()

Returns the audio device sample rate. Will throw an error if called before the `load` event has fired.

## getBlockSize()

Returns the audio device block size. Will throw an error if called before the `load` event has fired.

## getNumInputChannels()

Returns the number of input channels with which the audio device was opened.
Will throw an error if called before the `load` event has fired.

## getNumOutputChannels()

Returns the number of output channels with which the audio device was opened.
Will throw an error if called before the `load` event has fired.

## getQuantizationInterval()

Returns the quantization interval with which the runtime was prepared, or -1 if
no quantization was enabled. Will throw an error if called before the `load` event has fired.

## render(a, b, c, d, ...)

Accepts a variadic set of arguments, each one representing the audio signal that is
to be rendered into the given channel. For example, given arguments `a, b`, will render signal `a`
into the first output channel, and signal `b` into the second output channel.

Will throw an error if invoked before the `load` event has fired.
