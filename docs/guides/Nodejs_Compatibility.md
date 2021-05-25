# Node.js/npm Compatibility

The elementary runtime is itself a binary application much like Node.js, designed
to execute your scripts to build up audio signal processes. Elementary
is in fact built on Node.js itself, hence the tight compatibility.

Specifically, Elementary is currently built on Node.js v16.0.0 ([7162e68](https://github.com/nodejs/node/releases/tag/v16.0.0)),
therefore the following compatibility constraints apply:

* Any Node.js program which runs comfortably in Node.js v16.0.0 will run the same in Elementary
* Any npm packages which suppoort Node v16.0.0 will support Elementary
* Any native Node extensions _must_ be built by Node v16.0.0 for compatibility with Elementary
    - This is to ensure Node ABI compatibility between the compiled extension and Elementary
* When invoking Elementary at the command-line, any arguments not consumed by Elementary will be passed straight onto Node itself
    - E.g. writing `elementary --prof myapp.js` is much the same as writing `node --prof myapp.js`

If your application has compatibility requirements not addressed here, or must be tied to
a different version of Node.js, please open an issue.
