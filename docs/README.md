# Getting Started

Elementary is a JavaScript runtime based on Node.js for writing native audio applications, as well as a library and
framework for composing audio signal processes. Elementary aims to lower the barrier to entry into the
audio application space, eliminate the gap between prototyping and production, and bring the functional reactive
programming model to dsp.

Watch the [intro video](https://www.youtube.com/watch?v=AvCdrflFHu8) for the full story.

## Installation

**This project is currently pre-beta and macOS only. Installing and running on other platforms will not work.**

```bash
$ npm install @nick-thompson/elementary
```

Elementary has essentially two components: the *runtime*, and the *library*.

The *runtime* is a native binary application much like Node.js itself, and is available inside the `npm`
package. To install `elementary` globally at your command line, you can always `npm install -g @nick-thompson/elementary`, however,
the preferred method is to install as a local dependency and invoke the local binary at `./node_modules/.bin/elementary` or with
`npx elementary` ([more about npx here](https://www.npmjs.com/package/npx)). This way, the library component and the runtime component are always of matching versions.

The *library* component is basically the rest of the `npm` package, and is what you get when you write `require('@nick-thompson/elementary')`.
The library, explained in detail in the reference section, offers a set of convenience APIs and a growing set of library functions
to help you construct your audio signal chain.

## Examples

In the [GitHub repository](https://github.com/nick-thompson/elementary) you'll find a small set of example projects aiming to provide
a brief introduction to various functionality. Each example can be invoked on its own:

```bash
$ cd examples/00_HelloSine
$ npm install
$ npm start
```

And of course you can open these example files, poke around, and edit as you like!

## Licensing

The Elementary library available on `npm` and the command line application provided therein may be used under the terms of the AGPLv3, or a
commercial license, at your choosing. Please refer to the [full license text](https://github.com/nick-thompson/elementary/blob/6bd2ad18946e9b784e70642ac775f4e3b5ce727c/LICENSE.md) or [contact us](https://www.elementary.audio/embed#contact-section) about a commercial license.

If you're interested in embedding or extending the Elementary runtime, there is an additional Embedded Runtime SDK available under a commercial license.
For more information, please get in contact!
