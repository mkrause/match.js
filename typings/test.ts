///<reference lib="es2015"/>
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


// Expected error: Type 'number' is not assignable to type '"test1"'.
const test1 : 'test1' = match('foo', {
    foo: 42,
    bar: 'hello',
});

// Expected error: Type 'number' is not assignable to type '"test2"'.
const test2 : 'test2' = match('foo', {
    foo: (tag : string) : number => 42,
    bar: 'hello',
});

// Same as test2, but use an invalid callback function type (this is an error by the caller, not `match`)
// Expected error: Type 'unknown' is not assignable to type '"test2_invalidFunctionType"'.
const test2_invalidFunctionType : 'test2_invalidFunctionType' = match('foo', {
    foo: (tag : boolean) : number => 42,
    bar: 'hello',
});

// Expected error: Type 'string | number | boolean' is not assignable to type '"test3"'.
const test3 : 'test3' = match('nonexistent', {
    [match.default]: true,
    foo: (tag : string) : number => 42,
    bar: 'hello',
});

// Expected error: Type 'string | number | boolean' is not assignable to type '"test4"'.
const test4 : 'test4' = match('nonexistent', {
    [match.default]: () : boolean => true,
    foo: (tag : string) : number => 42,
    bar: 'hello',
});

// Expected error: Type 'number' is not assignable to type '"test5"'.
const test5 : 'test5' = match('nonexistent', {
    foo: 42,
});


// Expected error: Type 'string | number' is not assignable to type '"test6"'.
const d : string = 'random' + Math.random();
const test6 : 'test6' = match(d, {
    foo: (tag : string) : number => 42,
    bar: 'hello',
});
