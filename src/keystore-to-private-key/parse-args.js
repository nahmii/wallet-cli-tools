'use strict';

const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');

module.exports = (isTTY) => {
  const usage = '$0 [keystore]';

  const _yargs = yargs(hideBin(process.argv))
    .usage(usage, 'Retrieve private key from keystore file and password', (yargs) => {

      if (isTTY) {
        yargs
          .positional('keystore', {
            describe: 'Serialized keystore',
            type: 'string'
          })
          .option('file', {
            alias: 'f',
            describe: 'Keystore file',
            type: 'string'
          })
          .conflicts('keystore', 'file');
      }

      yargs
        .option('password', {
          alias: 'p',
          describe: 'Password for encrypting the keystore',
          demandOption: true,
          type: 'string'
        });
    })
    .strict()
    .help('h')
    .alias('h', 'help');

  return {argv: _yargs.parse(), showHelp: _yargs.showHelp.bind(_yargs)};
};
