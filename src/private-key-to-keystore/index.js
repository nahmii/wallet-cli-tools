#!/usr/bin/env node

'use strict';

const readline = require('readline');
const parseArgs = require('./parse-args');
const createKeystoreFile = require('./create-keystore-file');
const passwordGeneratorFactory = require('./password-generator-factory');

(async () => {
  if (process.stdin.isTTY) {
    const argv = parseArgs(true);

    let outputPassword = false;

    if (!argv.password && argv.passwordGenerator) {
      const passwordGenerator = passwordGeneratorFactory.create(argv.passwordGenerator);
      argv.password = await passwordGenerator.generate();

      outputPassword = true;
    }

    await createKeystoreFile({
      ...argv,
      outputPassword
    });

  } else {
    const argv = parseArgs(false);

    const rl = readline.createInterface({
      input: process.stdin
    });

    let passwordGenerator;

    if (!argv.password && argv.passwordGenerator) {
      passwordGenerator = passwordGeneratorFactory.create(argv.passwordGenerator);
    }

    rl.on('line', async (privateKey) => {
      let outputPassword = false;

      if (passwordGenerator) {
        argv.password = await passwordGenerator.generate();

        outputPassword = true;
      }

      await createKeystoreFile({
        ...argv,
        privateKey,
        outputPassword
      });
    });
  }
})();
