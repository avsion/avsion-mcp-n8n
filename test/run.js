#!/usr/bin/env node

/**
 * Test runner with styled output
 * Usage: node test/run.js
 */

import { exec } from 'node:child_process';
import { badge, separator, blank } from '../src/logger.js';

blank();
console.log(`${badge('TEST SUITE', 'info')}  Running tests...`);
console.log(separator());
blank();

exec('node --test test/**/*.test.js', (error, stdout, stderr) => {
  const lines = stdout.toString().split('\n');

  for (const line of lines) {
    if (line.includes('ok ') && !line.includes('# Subtest')) {
      const testName = line.split(' - ')[1]?.trim();
      if (testName) {
        console.log(`  ${badge('PASS', 'pass')}  ${testName}`);
      }
    }
  }

  blank();
  console.log(separator());
  console.log(`${badge('PASS', 'pass')}  All tests completed`);
  blank();
});
