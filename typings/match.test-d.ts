///<reference lib="es2019"/>
///<reference path="./match.d.ts"/>

// Test module to test TypeScript declaration.
// Usage: `tsd`.

import { expectType, expectError } from 'tsd';
import match, { matcher, matchType, matchSingleKey } from '@mkrause/match';


//
// Test: `match`
//

{
    // Fixtures: a discriminator and a case map that are as general as possible
    const discrimGeneral = undefined as unknown as (string | number | symbol);
    const casesGeneral = undefined as unknown as object;
    
    
    // Scenario: both the discriminator and the case map are as general as possible
    // Note: both of these should return `never`. Reasoning: in the `{}` case, there will never be a match. In
    // the "general" (unknown type) case, we cannot distinguish this from `{}`. If you need a dynamic case map,
    // then make sure to cast to a more specific type.
    expectType<never>(match(discrimGeneral, casesGeneral)); // General case map (`keyof` is `never`)
    expectType<never>(match(discrimGeneral, {})); // Empty case map (`keyof` is `never`)
    
    
    // Scenario: case map has an indexer, but otherwise unknown keys
    // Should return `unknown` (reason: the discriminator may be present, we don't know)
    const casesIndexed = undefined as unknown as { [key : number] : unknown };
    expectType<never>(match('foo' as const, casesIndexed));
    expectType<unknown>(match(42 as const, casesIndexed));
    
    
    // Scenario: the discriminator is general, the case map is known (should return the union of all possible cases)
    expectType<42 | 'hello'>(
        match(discrimGeneral, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: the discriminator is known exactly, and is present in the case map
    expectType<42>(
        match('foo' as const, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: the discriminator is known exactly, and is not present in the case map
    // TODO: ideally this should be `never`, but we cannot currently capture this in the type definition.
    expectType<42 | 'hello'>(
        match('nonexistent' as const, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: the case result is a function, but it is not of the required callback function type
    // Note: currently returns `unknown` to indicate a caller type error
    expectType<unknown>(
        match('foo', {
            foo: (discrim : boolean) => 42 as const, // Invalid callback type
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: the case result is a function, and it is of the right callback type
    expectType<42 | 'hello'>(
        match(discrimGeneral, {
            foo: (discrim : typeof discrimGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    expectType<42>(
        match('foo' as const, {
            foo: (discrim : typeof discrimGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: a default case is present
    expectType<true | 42 | 'hello'>(
        match(discrimGeneral, {
            [match.default]: true as const,
            foo: (discrim : typeof discrimGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    
    // Scenario: a default case is present, and we know the discriminator is not present
    // TODO: should ideally select the type of the default case, but this is currently hard to capture
    expectType<true | 42 | 'hello'>(
        match('nonexistent' as const, {
            [match.default]: true as const,
            foo: (discrim : typeof discrimGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    
    // Scenario: a default case is present, and we know the discriminator is present
    expectType<42>(
        match('foo' as const, {
            [match.default]: true as const,
            foo: (discrim : typeof discrimGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    
    // Scenario: a default case is present, and we explicitly select the default case
    expectType<true>(
        match(match.default, {
            [match.default]: true as const,
            foo: (discrim : typeof discrimGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
};


/*
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
*/
