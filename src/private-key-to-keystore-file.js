#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const Wallet = require('ethereumjs-wallet').default;
const fs = require('fs/promises');
const path = require('path');
const readline = require('readline');

const parseArgs = (isTTY) => {
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

const createKeystoreFile = async ({privateKey, password, fileOutput, outputDir}) => {
  const key = Buffer.from(privateKey.replace(/^0x/, ''), 'hex');
  const wallet = Wallet.fromPrivateKey(key);

  const keystore = await wallet.toV3String(password);
  if (fileOutput) {
    const filePath = path.join(outputDir, wallet.getV3Filename());
    await fs.mkdir(outputDir, {recursive: true});
    await fs.writeFile(filePath, keystore);
    console.log(`Keystore output to '${filePath}'`);
  } else {
    console.log(keystore);
  }
};

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
