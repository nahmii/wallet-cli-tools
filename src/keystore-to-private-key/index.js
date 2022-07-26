#!/usr/bin/env node

'use strict';

const readline = require('readline');
const readPrivateKey = require('./read-private-key');
const parseArgs = require('./parse-args');
const os = require('os');
const config = require('./config');

(async () => {
  if (process.stdin.isTTY) {
    const {argv} = parseArgs(true);

    const privateKey = await readPrivateKey(argv);
    process.stdout.write(privateKey + os.EOL);

  } else {
    const {argv, showHelp} = parseArgs(true);

    const rl = readline.createInterface({
      input: process.stdin
    });

    rl.on('line', async (keystore) => {
      if (argv.file) {
        showHelp();
        process.stderr.write(os.EOL + 'Arguments keystore and file are mutually exclusive' + os.EOL);
        process.exit(config.exit.fileAndKeystoreOptionsMutuallyExclusive);
      }

      const privateKey = await readPrivateKey({
        ...argv,
        keystore
      });
      process.stdout.write(privateKey + os.EOL);
    });
  }
})();
