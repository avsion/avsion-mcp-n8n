#!/usr/bin/env node

/**
 * Demo script showing styled terminal output
 * Run with: node examples/demo-output.js
 * Matches the reference image style
 */

import { badge, separator, testResult } from '../src/logger.js';

console.clear();

// Test Results - matching the reference image style
console.log('');

testResult('PASS', 'should have a package.json with correct fields', 'pass');

testResult('PASS', 'should export main entry point', 'pass');

console.log('');
