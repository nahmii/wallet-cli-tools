#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const wallet = require('ethereumjs-wallet').default;

const argv = yargs(hideBin(process.argv))
  .usage('$0 [options]', 'Generate private key(s)')
  .option('c', {
    alias: 'count',
    demandOption: false,
    describe: 'The number of private keys.',
    type: 'number',
    default: 1
  })
  .option('a', {
    alias: 'address',
    demandOption: false,
    describe: 'Output address alongside the private key.',
    type: 'boolean'
  })
  .option('i', {
    alias: 'index',
    demandOption: false,
    describe: 'Prefix each line with index. Useful in particular with count > 1',
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

  console.log(line);
}
