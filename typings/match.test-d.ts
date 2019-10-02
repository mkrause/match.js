///<reference lib="es2019"/>
///<reference path="./match.d.ts"/>

// Test module to test TypeScript declaration.
// Usage: `tsd`.

import { expectType, expectError } from 'tsd';
import match, { matcher, matchType, matchSingleKey } from '@mkrause/match';
import { Tag, CaseMap } from '@mkrause/match'; // Types


// Marker for return values that may throw an error. Currently just for documentation purposes, we do not actually
// capture the exception in the type.
type Failable<T> = T;

type CallerError = unknown;

// Fixtures: a tag and a case map that are as general as possible
const tagGeneral = undefined as unknown as (string | number | symbol);
const casesGeneral = undefined as unknown as object;


// Test: `match`
{
    expectError(match());
    expectError(match(null));
    expectError(match('foo'));
    expectError(match('foo', null));
    expectError(match(0, [1, 2, 3]));
    
    
    // Scenario: case map is of type `object` (most general type allowed), thus `keyof C` = `never`.
    // Note: ideally the case map should never be of type `object`, should be constrained to an object with an
    // explicit `keyof`. But this is currently impossible to capture (see declaration file).
    //expectType<unknown>(match('foo' as const, casesGeneral)); // Perhaps more logical (but not worth the effort)
    // expectType<never>(match('foo' as const, casesGeneral));
    expectError(match('foo', casesGeneral));
    
    
    // Scenario: the case map is empty (i.e. `keyof C` = `never).
    // Should return `never`, will always throw.
    expectType<Failable<never>>(match(tagGeneral, {}));
    
    
    // Scenario: case map has an indexer, but otherwise unknown keys.
    // Should return `unknown` (reason: the tag may be present, we don't know).
    const casesIndexed = undefined as unknown as { [key : number] : boolean };
    expectType<Failable<boolean>>(match('foo' as const, casesIndexed));
    expectType<boolean>(match(42 as const, casesIndexed));
    
    
    // Scenario: the tag is general, the case map is known (should return the union of all possible cases).
    expectType<Failable<42 | 'hello'>>(
        match(tagGeneral, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: the tag is known exactly, and is present in the case map.
    expectType<42>(
        match('foo' as const, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: the tag is known exactly, and is not present in the case map.
    // Note: ideally this should be `never`, but we cannot currently capture this in the type definition.
    expectType<Failable<42 | 'hello'>>(
        match('nonexistent' as const, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: the case result is a function, but it is not of the required callback function type.
    // Note: currently returns `unknown` to indicate a caller type error.
    expectType<CallerError>(
        match('foo', {
            foo: (tag : boolean) => 42 as const, // Invalid callback type
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: the case result is a function, and it is of the right callback type.
    expectType<42 | 'hello'>(
        match(tagGeneral, {
            foo: (tag : typeof tagGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    expectType<42>(
        match('foo' as const, {
            foo: (tag : typeof tagGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    
    
    // Scenario: a default case is present.
    expectType<true | 42 | 'hello'>(
        match(tagGeneral, {
            [match.default]: true as const,
            foo: (tag : typeof tagGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    
    // Scenario: a default case is present, and we know the tag is not present.
    // TODO: should ideally select the type of the default case, but this is currently hard to capture
    expectType<true | 42 | 'hello'>(
        match('nonexistent' as const, {
            [match.default]: true as const,
            foo: (tag : typeof tagGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    
    // Scenario: a default case is present, and we know the tag is present.
    expectType<42>(
        match('foo' as const, {
            [match.default]: true as const,
            foo: (tag : typeof tagGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
    
    // Scenario: a default case is present, and we explicitly select the default case.
    expectType<true>(
        match(match.default, {
            [match.default]: true as const,
            foo: (tag : typeof tagGeneral) => 42 as const,
            bar: 'hello' as const,
        })
    );
};


// Test: `matchType`
{
    expectError(matchType());
    expectError(matchType(null));
    expectError(matchType('foo'));
    expectError(matchType('foo', {}));
    expectError(matchType({ notype: 'foo' }, {}));
    
    expectType<Failable<never>>(
        matchType({ type: 'foo' }, {})
    );
    
    expectType<Failable<42 | 'hello'>>(
        matchType({ type: 'nonexistent' }, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    expectType<42>(
        matchType({ type: 'foo' }, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    expectType<Failable<42 | 'hello' | true>>(
        matchType({ type: 'nonexistent' }, {
            foo: 42 as const,
            bar: 'hello' as const,
            [match.default]: true as const,
        })
    );
    
    expectType<true>(
        matchType({ type: match.default }, {
            foo: 42 as const,
            bar: 'hello' as const,
            [match.default]: true as const,
        })
    );
    
    expectType<CallerError>(
        matchType({ type: 'foo', x : 10 }, {
            foo: (subject : { type : Tag, x : boolean }) => subject.x,
            bar: 'hello' as const,
            [match.default]: true as const,
        })
    );
    
    expectType<10>(
        matchType({ type: 'foo' as const, x : 10 as const }, {
            foo: (subject : { type : Tag, x : 10 }) => subject.x,
            bar: 'hello' as const,
            [match.default]: true as const,
        })
    );
};


// Test: `matchSingleKey`
{
    expectError(matchSingleKey());
    expectError(matchSingleKey(null));
    expectError(matchSingleKey('foo'));
    expectError(matchSingleKey({ foo: null }));
    expectError(matchSingleKey({ foo: null }, [1, 2, 3]));
    
    expectType<Failable<never>>(
        matchSingleKey({ foo: null }, {})
    );
    
    // Should fail due to not being single-keyed
    expectType<never>(
        matchSingleKey({ foo: null, bar: null }, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    expectType<never>(
        matchSingleKey({}, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    // If the subject is single-keyed, but the key is of a general type (e.g. `string`), it should resolve to all cases
    expectType<Failable<42 | 'hello'>>(
        matchSingleKey({ [tagGeneral]: null }, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    expectType<Failable<42 | 'hello'>>(
        matchSingleKey({ nonexistent: null }, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    // Should succeed, with known case
    expectType<42>(
        matchSingleKey({ foo: null }, {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    expectType<'payload'>(
        matchSingleKey({ foo: 'payload' as const }, {
            foo: (payload : 'payload') => payload,
            bar: 'hello' as const,
        })
    );
};


// Test: `matcher`
{
    expectError(matcher());
    expectError(matcher(null));
    expectError(matcher((subject : [Tag, string]) => ({}))); // Wrong return type
    
    
    // Fixture: valid parser
    const subjectParser = (subject : [Tag, { x : number }]) => ({ tag: subject[0], body: subject[1] });
    const customMatcher = matcher(subjectParser);
    
    expectType<42 | 'hello'>(
        customMatcher(['foo' as const, { x : 10 as const }], {
            foo: 42 as const,
            bar: 'hello' as const,
        })
    );
    
    expectType<42 | 'hello' | true>(
        customMatcher(['foo' as const, { x : 10 as const }], {
            foo: 42 as const,
            bar: 'hello' as const,
            [match.default]: true as const,
        })
    );
    
    expectType<42 | 'hello' | true>(
        customMatcher([match.default, { x : 10 as const }], {
            foo: 42 as const,
            bar: 'hello' as const,
            [match.default]: true as const,
        })
    );
    
    expectType<number | 'hello' | true>(
        customMatcher(['foo' as const, { x : 10 as const }], {
            foo: (subject : { x : number }) => subject.x,
            bar: 'hello' as const,
            [match.default]: true as const,
        })
    );
    
    expectType<42 | 'hello' | number>(
        customMatcher([match.default, { x : 10 as const }], {
            foo: 42 as const,
            bar: 'hello' as const,
            [match.default]: (subject : { x : number }) => subject.x,
        })
    );
};
