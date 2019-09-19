///<reference path="./match.d.ts"/>

// Test module to test TypeScript declaration file.
// Usage:
//   $ tsc --noEmit --strict --esModuleInterop --lib es2015 typings/test.ts
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


// Expected error: Type 'number' is not assignable to type '"test"'.
const test1 : 'test' = match('foo', {
    foo: 42,
    bar: 'hello',
});

// Expected error: Type 'number' is not assignable to type '"test"'.
const test2 : 'test' = match('foo', {
    foo: (tag : string) : number => 42,
    bar: 'hello',
});

// Expected error: Type 'boolean' is not assignable to type '"test"'.
const test3 : 'test' = match('nonexistent', {
    foo: (tag : string) : number => 42,
    bar: 'hello',
    '__@@default': true,
});

// Expected error: Type 'boolean' is not assignable to type '"test"'.
const test4 : 'test' = match('nonexistent', {
    foo: (tag : string) : number => 42,
    bar: 'hello',
    '__@@default': () : boolean => true,
});

// Expected error: none (result should be type `never`, which is assignable to any type)
const test5 : never = match('nonexistent', {
    foo: 42,
});
