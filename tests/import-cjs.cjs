
/*
Test the public interface of this package, simulating a CommonJS consumer.

Note: this is intended to run in Node.js directly without transpiling, so only use features of Node that are supported
by all supported Node.js versions.
*/

const assert = require('node:assert');

// Test: importing a CJS package from a CJS context
const match = require('case-match');
//console.log(match);
assert(typeof match.default === 'function');
assert(typeof match.match === 'function');
assert(typeof match.matchType === 'function');
assert(typeof match.matchSingleKey === 'function');
assert(typeof match.matcher === 'function');


// Test: importing an ESM package from a CJS context
import('case-match')
  .then((msg) => {
    assert(typeof match.default === 'function');
    assert(typeof match.match === 'function');
    assert(typeof match.matchType === 'function');
    assert(typeof match.matchSingleKey === 'function');
    assert(typeof match.matcher === 'function');
  });
