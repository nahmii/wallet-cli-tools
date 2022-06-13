'use strict';

const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');
const os = require('os');
const config = require('./config');

module.exports = (isTTY) => {
  const usage = `$0 ${isTTY ? '<private-key>' : '[private-key]'}`;

  const argv = yargs(hideBin(process.argv))
    .usage(usage, 'Generate keystore file from private key and password', (yargs) => {

      if (isTTY) {
        yargs
          .positional('private-key', {
            describe: 'Private key',
            type: 'string'
          });
      }

      yargs
        .option('password', {
          alias: 'p',
          describe: 'Password for encrypting the keystore',
          type: 'string'
        })
        .option('password-generator', {
          alias: 'P',
          describe: 'Password generator executable or text file with one password per line',
          type: 'string'
        })
        .option('file-output', {
          alias: 'F',
          describe: 'Output to file if true, else output to std out',
          type: 'boolean',
          default: false
        })
        .option('output-directory', {
          alias: 'd',
          describe: 'Directory for file output',
          default: 'keystore',
          type: 'string'
        })
        .option('output-file', {
          alias: 'f',
          describe: 'Directory for file output. If not provided the name will be generated according to a template of \'UTC--<timestamp>--<address>\'',
          type: 'string'
        })
        .option('key-derivation-function', {
          alias: 'k',
          describe: 'Key derivation function',
          type: 'string',
          default: 'pbkdf2',
          choices: ['pbkdf2', 'scrypt']
        });
    })
    .parserConfiguration({
      'parse-positional-numbers': false
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
