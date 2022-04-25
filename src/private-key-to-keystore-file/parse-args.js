#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');
const os = require('os');
const config = require('./config');

module.exports = (isTTY) => {
  const usage = `$0 ${isTTY ? '<private-key>' : ''} [options]`;

  const argv = yargs(hideBin(process.argv))
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
          demandOption: false,
          describe: 'Password for encrypting the keystore.',
          type: 'string'
        })
        .option('password-generator', {
          alias: 'P',
          demandOption: false,
          describe: 'Password generator executable or text file with one password per line.',
          type: 'string'
        })
        .option('file-output', {
          alias: 'F',
          default: false,
          demandOption: false,
          describe: 'Output to file. If not provided the keystore is sent to std out.',
          type: 'boolean'
        })
        .option('output-directory', {
          alias: 'd',
          default: 'keystore',
          demandOption: false,
          describe: 'Directory for file output.',
          type: 'string'
        })
        .option('output-file', {
          alias: 'f',
          demandOption: false,
          describe: 'Directory for file output. If not provided the name will be generated according to a template of \'UTC--<timestamp>--<address>\'.',
          type: 'string'
        })
        .option('key-derivation-function', {
          alias: 'k',
          demandOption: false,
          default: 'pbkdf2',
          choices: ['pbkdf2', 'scrypt'],
          describe: 'Key derivation function.',
          type: 'string'
        });
    })
    .conflicts('p', 'P')
    .strict()
    .help('h')
    .alias('h', 'help')
    .argv;

  if (!argv.password && !argv.passwordGenerator) {
    yargs.showHelp(s => process.stderr.write(s + os.EOL + os.EOL + 'The command line must include either p or P' + os.EOL));
    process.exit(config.exit.passwordAndPasswordGeneratorNeeded);
  }

  return argv;
};
