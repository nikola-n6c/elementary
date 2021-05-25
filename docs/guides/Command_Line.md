# Command Line

When working with the `elementary` command line tool, the following help menu is available
by passing the `--help` or `-h` flag. Here we'll go into more detail about each of the available options.

```bash
Usage: elementary [options] [node_options] file.js

    Run the given file with elementary.

Examples:

    elementary -i 2 -o 2 path/to/flanger.js
    elementary --inputs=2 --outputs=2 path/to/flanger.js

Options:

    -h, --help      Print this help and exit
    -i, --inputs    Set the number of input channels with which to open the driver. Default: 0.
    -o, --outputs   Set the number of output channels with which to open the driver. Default: 2.
    -s, --stack     Set the rendering stack size. Default: 512.
    -e, --heap      Set the rendering heap size. Default: 512.
    -q, --quantize  Set the rendering quantization interval. Default: -1 (off).
    -f, --file      Drive the runtime from an audio file instead of from system input.
```

## Options

* *Inputs*
    * `-i, --inputs`
    * Sets the number of input channels with which to open the driver. For example, if you want to process your microphone
      signal as a stereo input, you would set this to 2.
* *Outputs*
    * `-i, --inputs`
    * Sets the number of output channels with which to open the driver. For example, if you want to procedurally generate a
      drum pattern and output your kick on one channel, your snare on another, and your hats on a third, you can set this to 3.
    * Generally this corresponds with how many arguments you pass to `core.render`: e.g. `core.render(kick, snare, hat)`, as the arguments
      here posititionally correspond with which output channel you're writing to.
* *Stack*
    * `-s, --stack`
    * This option will likely often be unnecessary. It allows you to tune how much memory Elementary will allocate to prepare for
      rendering your audio process.
    * If you exceed the memory allocation you'll receive an error message, so if you find yourself needing more memory you can set this value
      larger. Or, if you need to run in a resource-constrained environment you can tune this value down to exactly as much as you need.
* *Heap*
    * `-e, --heap`
    * Like *stack*, this option will likely often be unnecessary. It's another way to tune how much memory Elementary will allocate to prepare for
      rendering your audio process.
    * If you exceed the memory allocation you'll receive an error message, so if you find yourself needing more memory you can set this value
      larger. Or, if you need to run in a resource-constrained environment you can tune this value down to exactly as much as you need.
* *Quantize*
    * `-q, --quantize`
    * Specifies the rendering event quantization interval in milliseconds.
    * Setting this value to anything above zero will have Elementary defer any changes made during a call to `core.render` until the next quantize
      boundary. For example, if you want to change the frequency of a synth note exactly in time with an LFO period, you can do so with this.
* *File*
    * `-f, --file`
    * Passing this argument will run Elementary with an input signal read from a file instead of from your microphone or system driver.
    * This too will enable offline rendering mode so that you can process to and from files as fast as possible.
    * This option is not currently supported in the private beta, but will be shortly.

Finally, any options present at the command line that are not consumed while processing for the above list will be passed onto initialize Node.js.
With that, you can always pass Node.js-specific options such as `--prof` to enable such behavior in Node.
