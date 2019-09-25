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



import match, { matcher, matchType, matchSingleKey } from '@mkrause/match';


// Expected error: Type '42 | "hello"' is not assignable to type '"test1"'.
const test0 : 'test0' = match('foo' as string, {
    foo: 42 as const,
    bar: 'hello' as const,
});

// Expected error: Type 'number' is not assignable to type '"test1"'.
const test1 : 'test1' = match('foo', {
    foo: 42 as const,
    bar: 'hello' as const,
});

// Expected error: Type 'number' is not assignable to type '"test2"'.
const test2 : 'test2' = match('foo', {
    foo: (tag : string) => 42 as const,
    bar: 'hello' as const,
});

// Same as test2, but use an invalid callback function type (this is an error by the caller, not `match`)
// Expected error: Type 'unknown' is not assignable to type '"test2_invalidFunctionType"'.
const test2_invalidFunctionType : 'test2_invalidFunctionType' = match('foo', {
    foo: (tag : boolean) => 42 as const,
    bar: 'hello' as const,
});

// Expected error: Type 'string | number | boolean' is not assignable to type '"test3"'.
const test3 : 'test3' = match('nonexistent', {
    [match.default]: true as const,
    foo: (tag : string) => 42 as const,
    bar: 'hello' as const,
});

// Expected error: Type 'string | number | boolean' is not assignable to type '"test4"'.
const test4 : 'test4' = match('nonexistent', {
    [match.default]: () => true as const,
    foo: (tag : string) => 42 as const,
    bar: 'hello' as const,
});

// Expected error: Type 'number' is not assignable to type '"test5"'.
const test5 : 'test5' = match('nonexistent', {
    foo: 42 as const,
});


// Expected error: Type 'string | number' is not assignable to type '"test6"'.
const d : string = 'random' + Math.random();
const test6 : 'test6' = match(d, {
    foo: (tag : string) => 42 as const,
    bar: 'hello' as const,
});


// Test scenario where the type of the case list is unknown (beyond being an `object`)
// TODO: seems to return `never`
const cases : object = null as unknown as object;
const test7 : 'test7' = match(d, cases);


const test_matchType_1 : 'test_matchType_1' = matchType({ type: 'foo' }, {
    foo: 42 as const,
    bar: 'hello' as const,
});

// Expected error: Type '42 | "hello"' is not assignable to type '"test_matchType_2"'
const type : string = 'foo' as string;
const test_matchType_2 : 'test_matchType_2' = matchType({ type }, {
    foo: 42 as const,
    bar: 'hello' as const,
});



// const test_matchSingleKey_1 : 'test_matchSingleKey_1' = matchSingleKey({ foo: null }, {
//     foo: 42 as const,
//     bar: 'hello' as const,
// });



const matcher1 = matcher((s : string) => ({ discriminator: s, body: s }));

// Expected error: Type '42 | "hello"' is not assignable to type '"test_matcher_1"'.
const test_matcher_1 : 'test_matcher_1' = matcher1('foo', {
    foo: 42 as const,
    bar: 'hello' as const,
});

// Expected error: Type '42 | "hello"' is not assignable to type '"test_matcher_2"'.
const test_matcher_2 : 'test_matcher_2' = matcher1('foo', {
    foo: (discriminator : string) => 42 as const,
    bar: 'hello' as const,
});
