# Signals

Builtin helpers for deriving and manipulating specific signal flows.


### el.adsr(a, d, s, r, g)

An exponential ADSR envelope generator, triggered by the gate signal `g`. When the
gate is high (1), this generates the ADS phase. When the gate is low, the R phase.

Expected children:
1. Attack time in seconds (number or signal)
2. Decay time in seconds (number or signal)
3. Sustain amplitude between 0 and 1 (number or signal)
4. Release time in seconds (number or signal)
5. Gate signal; a pulse train alternating between 0 and 1

#### Props

None

### el.seq

A simple signal sequencer. Receives a sequence of values from the `seq` property
and steps through them on each rising edge of an incoming pulse train. Expects exactly
one child, the pulse train to trigger the next step of the sequence.

Example:
```js
el.sample(
  {path: '/path/to/kick.wav'},
  el.seq(
    {seq: [1, 0, 1, 0, 0, 0, 1, 1]},
    el.train(2)
  )
)
```

#### Props

| Name     | Default  | Type   | Description                                                              |
| -------- | -------- | --------------------------------------------------------------------------------- |
| seq      | []       | Array  | The sequence of values to generate                                       |
| hold     | false    | Bool   | When true, continues to output the sequence value until the next trigger |

### el.hann(t)

A simple Hann window generator. The window is generated according to an incoming phasor
signal, where a phase value of 0 corresponds to the left hand side of the window, and a
phase value of 1 corresponds to the right hand side of the window. Expects exactly one child,
the incoming phase.

Example:
```js
el.hann(el.phasor(1))
```

#### Props

None
