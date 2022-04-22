#!/usr/bin/env node

'use strict';

const readline = require('readline');
const parseArgs = require('./parse-args');
const createKeystoreFile = require('./create-keystore-file');

(async () => {
  if (process.stdin.isTTY) {
    const argv = parseArgs(true);
    await createKeystoreFile(argv);
  } else {
    const argv = parseArgs(false);

    const rl = readline.createInterface({
      input: process.stdin
    });

    rl.on('line', async (privateKey) => {
      await createKeystoreFile({
        ...argv,
        privateKey
      });
    });
  }
})();
