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
          alias: 'F',
          default: false,
          demandOption: false,
          describe: 'Output to file. If not provided the keystore is sent to std out.',
          TYPE: 'BOOLEAN'
        })
        .option('output-directory', {
          alias: 'd',
          default: 'keystore',
          demandOption: false,
          describe: 'The directory for file output.',
          type: 'string'
        })
        .option('output-file', {
          alias: 'f',
          demandOption: false,
          describe: 'The directory for file output. If not provided the name will be generated according to a template of \'UTC--<timestamp>--<address>\'.',
          type: 'string'
        })
        .option('key-derivation-function', {
          alias: 'k',
          demandOption: false,
          default: 'pbkdf2',
          choices: ['pbkdf2', 'scrypt'],
          describe: 'The key derivation function.',
          type: 'string'
        });
    })
    .strict()
    .help('h')
    .alias('h', 'help')
    .argv;
};
