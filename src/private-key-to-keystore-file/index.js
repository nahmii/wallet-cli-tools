#!/usr/bin/env node

'use strict';

const readline = require('readline');
const parseArgs = require('./parse-args');
const createKeystoreFile = require('./create-keystore-file');
const generatePassword = require('./generate-password');

(async () => {
  if (process.stdin.isTTY) {
    const argv = parseArgs(true);

    let outputPassword = false;

    if (!argv.password && argv.passwordGenerator) {
      argv.password = await generatePassword(argv.passwordGenerator);
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

    rl.on('line', async (privateKey) => {
      let outputPassword = false;

      if (!argv.password && argv.passwordGenerator) {
        argv.password = await generatePassword(argv.passwordGenerator);
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
