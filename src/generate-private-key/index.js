#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const wallet = require('ethereumjs-wallet').default;
const os = require('os');

const argv = yargs(hideBin(process.argv))
  .usage('$0', 'Generate private key(s)')
  .option('count', {
    alias: 'c',
    describe: 'Number of private keys',
    type: 'number',
    default: 1
  })
  .option('address', {
    alias: 'a',
    describe: 'Output address alongside the private key',
    type: 'boolean'
  })
  .option('index', {
    alias: 'i',
    describe: 'Prefix each line with index, for use with larger values of count',
    type: 'boolean'
  })
  .strict()
  .help('h')
  .alias('h', 'help')
  .argv;

for (let index = 0; index < argv.count; index++) {
  const addressData = wallet.generate();

  let line = '';

  if (argv.index)
    line += `${index}: `;

  line += addressData.getPrivateKeyString();

  if (argv.address)
    line += ` ${addressData.getAddressString()}`;

  process.stdout.write(line + os.EOL);
}
