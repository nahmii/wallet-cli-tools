#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const BlockByDate = require('ethereum-block-by-date');
const ethers = require('ethers');
const yaml = require('js-yaml');
const os = require('os');

const updateDate = (d) => ({...d, date: new Date(d.timestamp * 1000).toISOString()});

const _yargs = yargs(hideBin(process.argv))
  .usage('$0 <start> [end]', 'Extract block info from datetime(s)')
  .positional('start', {
    describe: 'The start datetime in ISO format',
    type: 'string'
  })
  .positional('end', {
    describe: 'The end datetime in ISO format',
    type: 'string'
  })
  .option('after', {
    alias: 'a',
    describe: 'If true search for the nearest block after the given date, else before',
    type: 'boolean',
    default: true
  })
  .option('duration', {
    alias: 'd',
    describe: 'Duration per period',
    type: 'integer',
    default: 1,
    hidden: true
  })
  .option('output-format', {
    alias: 'o',
    type: 'string',
    choices: ['json', 'yaml'],
    default: 'json'
  })
  .option('period', {
    alias: 'P',
    describe: 'Period delimiting blocks in range',
    type: 'string',
    choices: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute'],
    default: 'week',
    implies: 'range'
  })
  .option('provider', {
    alias: 'p',
    describe: 'JSON-RPC provider URI',
    type: 'string',
    default: 'https://l1.nahmii.io'
  })
  .option('range', {
    alias: 'r',
    describe: 'Output range of block between start and end',
    type: 'boolean',
    default: false
  })
  .option('refresh', {
    alias: 'r',
    describe: 'Refresh boundaries, i.e. recheck the latest block before request',
    type: 'boolean',
    default: false,
    hidden: true
  })
  .strict()
  .help('h')
  .alias('h', 'help');

const argv = _yargs.parse();

if (argv.range && !argv.end) {
  _yargs.showHelp();
  console.error(os.EOL + 'Missing dependent arguments:' + os.EOL + ' range -> end');
  process.exit(1);
}

const blockByDate = new BlockByDate(new ethers.providers.JsonRpcProvider(argv.provider));

(async () => {
  let data;

  if (!argv.end) {
    data = updateDate(await blockByDate.getDate(argv.start, argv.after, argv.refresh));
  } else {
    if (argv.range) {
      data = await blockByDate.getEvery(argv.period + 's', argv.start, argv.end, argv.duration, argv.after, argv.refresh);
    } else {
      data = await Promise.all([
        await blockByDate.getDate(argv.start, argv.after, argv.refresh),
        await blockByDate.getDate(argv.end, argv.after, argv.refresh)
      ]);
    }

    data = data.map(updateDate);
  }

  switch (argv.outputFormat) {
  case 'yaml':
    console.log(yaml.dump(data));
    break;
  case 'json':
  default:
    console.log(JSON.stringify(data));
  }
})();
