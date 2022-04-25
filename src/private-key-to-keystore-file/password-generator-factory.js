'use strict';

const fs = require('fs');
const util = require('util');
const config = require('./config');

const exec = util.promisify(require('child_process').exec);

function* createIndexIterator () {
  let index = 0;
  while (true) {
    yield index++;
  }
}

class GeneratorFromTextFile {
  #lines;
  #indexIterator;

  constructor(file) {
    this.#lines = fs.readFileSync(file)
      .toString()
      .split(/(\r\n|\r|\n)/)
      .filter(d => /\w+/.test(d));
    this.#indexIterator = createIndexIterator();
  }

  async generate() {
    return this.#lines[this.#indexIterator.next().value % this.#lines.length];
  }
}

class GeneratorFromExecutable {
  #executable;

  constructor(executable) {
    this.#executable = executable;
  }

  async generate() {
    try {
      const {stdout, stderr} = await exec(this.#executable);

      if (stderr) {
        console.error(stderr);
        process.exit(config.exit.passwordGeneratorFromExecutableStdErr);
      }

      return stdout.replace(/(\r\n|\r|\n)$/, '');
    } catch (err) {
      console.error(err.message);
      process.exit(config.exit.passwordGeneratorFromExecutableError);
    }
  }
}

module.exports = {
  create: (generatorSpec) => {
    try {
      if (generatorSpec.endsWith('.txt')) {
        return new GeneratorFromTextFile(generatorSpec);
      } else {
        return new GeneratorFromExecutable(generatorSpec);
      }
    } catch (err) {
      console.error(err.message);
      process.exit(config.exit.passwordGeneratorFactoryCreateError);
    }
  }
};
