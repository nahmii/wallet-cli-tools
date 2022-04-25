'use strict';

const util = require('util');
const config = require('./config');

const exec = util.promisify(require('child_process').exec);

module.exports = async (passwordGenerator) => {
  try {
    const {stdout, stderr} = await exec(passwordGenerator);

    if (stderr) {
      console.error(stderr);
      process.exit(config.exit.passwordGeneratorStdErr);
    }

    return stdout.replace(/(\r\n|\r|\n)$/, '');
  } catch (err) {
    console.error(err.message);
    process.exit(config.exit.passwordGeneratorError);
  }
};
