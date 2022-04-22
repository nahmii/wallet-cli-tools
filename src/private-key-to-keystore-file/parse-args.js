#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');

module.exports = (isTTY) => {
  const usage = `$0 ${isTTY ? '<private-key>' : ''} [options]`;

  return yargs(hideBin(process.argv))
    .usage(usage, 'Generate keystore file from private key and password', (yargs) => {

      if (isTTY) {
        yargs
          .positional('private-key', {
            describe: 'The private key.',
            type: 'string'
          })
          .parserConfiguration({
            'parse-positional-numbers': false
          })
        ;
      }

      yargs
        .option('password', {
          alias: 'p',
          demandOption: true,
          describe: 'The password for encrypting the keystore.',
          type: 'string'
        })
        .option('file-output', {
          alias: 'f',
          default: false,
          demandOption: false,
          describe: 'The output file directory. If not provided the keystore is sent to std out.',
          type: 'boolean'
        })
        .option('output-dir', {
          alias: 'o',
          default: 'keystore',
          demandOption: false,
          describe: 'The directory for file output.',
          type: 'string'
        });
    })
    .strict()
    .help('h')
    .alias('h', 'help')
    .argv;
};
