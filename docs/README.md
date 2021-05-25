# Getting Started

Elementary is a JavaScript runtime based on Node.js for writing native audio applications, as well as a library and
framework for composing audio signal processes. Elementary aims to lower the barrier to entry into the
audio application space, eliminate the gap between prototyping and production, and bring the functional reactive
programming model to dsp.

Watch the [intro video](https://www.youtube.com/watch?v=AvCdrflFHu8) for the full story.

## Installation

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

Inside the `npm` package you'll also find a small set of example projects at `./node_modules/@nick-thompson/elementary/examples`. Each
one can be invoked as its own npm package, for example:

```bash
$ npx elementary ./node_modules/@nick-thompson/elementary/examples/fm/
```

And of course you can open these example files, poke around, and edit as you like!

## Licensing

Elementary is dual licensed under either the AGPLv3, or a commercial license, at your choosing. Please refer to the [full license text linked here](https://www.gnu.org/licenses/agpl-3.0.html) or contact us about a commercial license.
