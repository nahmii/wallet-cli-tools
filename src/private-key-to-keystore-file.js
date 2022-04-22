#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const Wallet = require('ethereumjs-wallet').default;
const fs = require('fs/promises');
const path = require('path');

(async () => {
  const argv = yargs(hideBin(process.argv))
    .usage('$0 [options] <private-key>', 'Generate keystore file from private key and password', (yargs) => {
      yargs
        .positional('private-key', {
          describe: 'Private key',
          type: 'string'
        })
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
    .parserConfiguration({
      'parse-positional-numbers': false
    })
    .strict()
    .help('h')
    .alias('h', 'help')
    .argv;

  const key = Buffer.from(argv.privateKey.replace(/^0x/, ''), 'hex');
  const wallet = Wallet.fromPrivateKey(key);

  const keystore = await wallet.toV3String(argv.password);
  if (argv.fileOutput) {
    const filePath = path.join(argv.outputDir, wallet.getV3Filename());
    await fs.mkdir(argv.outputDir, {recursive: true});
    await fs.writeFile(filePath, keystore);
    console.log(`Keystore output to '${filePath}'`);
  } else {
    console.log(keystore);
  }
})();
