#!/usr/bin/env node

import process from 'node:process';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import run, { handleInfoCommand } from '../src/index.js';

yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .strict()
  .command(
    '$0',
    'get weather latitude and longitude',
    (builder) => builder
      .option('lat', {
        describe: 'Latitude',
        type: 'number',
      })
      .option('lon', {
        describe: 'Longitude',
        type: 'number',
      })
      .demandOption(['lat', 'lon'], 'Please provide latitude and longitude'),
    (argv) => {
      run(argv);
    },
  )
  .command('info', 'Fetch weather info', {}, handleInfoCommand)
  .command(
    'city',
    'get weather by city',
    (builder) => builder
      .option('city', {
        describe: 'City',
        type: 'string',
        demandOption: 'Please provide city',
      }),
    (argv) => {
      run(argv);
    },
  )
  .option('mode', {
    describe: 'Output mode',
    type: 'string',
    default: 'json',
    choices: ['json', 'xml', 'html'],
  })
  .option('output', {
    alias: 'o',
    describe: 'Output file path. If not provided, output to stdout',
    type: 'string',
  })
  .option('force', {
    alias: 'f',
    describe: 'Force re-write the file if it already exists',
    type: 'boolean',
    default: false,
  })
  .parse();
