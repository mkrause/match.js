
/*
Test the public interface of this package, simulating an ESM consumer.

Note: this is intended to run in Node.js directly without transpiling, so only use features of Node that are supported
by all supported Node.js versions.
*/


import assert from 'node:assert';

import match, { matchType, matchSingleKey, matcher } from 'case-match';


// Test: importing an ESM package from an ESM context
//console.log(msg);
assert(typeof match === 'function');
assert(typeof matchType === 'function');
assert(typeof matchSingleKey === 'function');
assert(typeof matcher === 'function');


// Note: importing a CJS package from an ESM context is not possible
//require('case-match');
