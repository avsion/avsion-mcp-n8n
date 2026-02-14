import { Transform } from 'node:stream';
import { separator, blank } from '../src/logger.js';

function createStyledReporter() {
  const tests = [];

  return new Transform({
    objectMode: true,
    transform(event, encoding, callback) {
      if (event.type === 'test:pass' || event.type === 'test:fail') {
        tests.push({
          name: event.data.name,
          status: event.type === 'test:pass' ? 'passed' : 'failed',
        });
      }
      callback();
    },
    flush(callback) {
      blank();
      console.log(separator());

      let pass = 0;
      let fail = 0;

      for (const test of tests) {
        if (test.status === 'passed') {
          pass++;
          console.log(`  ✓ ${test.name}`);
        } else {
          fail++;
          console.log(`  ✗ ${test.name}`);
        }
      }

      blank();
      console.log(separator());
      const allPass = fail === 0;
      console.log(`${allPass ? '✓' : '✗'}  ${pass}/${tests.length} tests passed`);
      blank();

      callback();
    },
  });
}

export default createStyledReporter;
