/**
 * Custom test reporter for Node.js test runner
 */

import { separator, blank } from './logger.js';

export class StyledReporter {
  #count = 0;
  #pass = 0;
  #fail = 0;
  #total = 0;

  start() {
    blank();
  }

  startTest(test) {
    this.#count++;
    this.#total = test.data?.tests || this.#count;
  }

  endTest(test, result) {
    const status = result.status === 'passed' ? 'pass' : 'fail';
    const label = result.status === 'passed' ? 'PASS' : 'FAIL';
    const indent = test.name.includes(' → ') ? '    ' : '  ';

    if (result.status === 'passed') {
      this.#pass++;
      console.log(`${indent}✓ ${test.name.split(' → ').pop()}`);
    } else {
      this.#fail++;
      console.log(`${indent}✗ ${test.name.split(' → ').pop()}`);
      if (result.error) {
        console.log(`${indent}    ${result.error.message}`);
      }
    }
  }

  end() {
    blank();
    console.log(separator());
    const allPass = this.#fail === 0;
    console.log(`${allPass ? '✓' : '✗'}  ${this.#pass}/${this.#count} tests passed`);
    blank();
  }
}
