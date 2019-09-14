///<reference path="./match.d.ts"/>

// Test module to test TypeScript declaration file.
// Usage:
//   $ tsc --noEmit --strict --esModuleInterop typings/test.ts
// See: https://stackoverflow.com/questions/49296151/how-to-write-tests-for-typescript-typing-definition


// import match, { matchAgainstObject } from '@mkrause/match';


// const body = { foo: 42 };
// const x : string | number = matchAgainstObject('foo', body, {
//     foo: 42,
//     bar: 'foo',
//     42: 42,
// });

// console.log('test');



import match from '@mkrause/match';

const x : number = match;

console.log('test');
