
import assert from 'assert';
import matchDefault, { match, matchType, matchSingleKey, matcher } from '../src/match.js';


describe('match.js', () => {
    describe('default export', () => {
        it('should be the same as `match`', () => {
            assert.strictEqual(matchDefault, match);
        });
    });
    
    describe('match', () => {
        it('should fail on lack of tag argument', () => {
            assert.throws(() => { match(); }, TypeError);
        });
        
        it('should fail on lack of case map argument', () => {
            assert.throws(() => { match('foo'); }, TypeError);
        });
        
        it('should fail if given an invalid tag', () => {
            [undefined, null, true, { x: 'hello' }, new Date()].forEach(tagInvalid => {
                assert.throws(() => { match(tagInvalid, { foo: 42 }); }, TypeError);
            });
        });
        
        it('should fail if given an invalid case map', () => {
            [undefined, null, true].forEach(casesInvalid => {
                assert.throws(() => { match('foo', casesInvalid); }, TypeError);
            });
        });
        
        it('should fail as unmatched if given an empty case map', () => {
            assert.throws(() => { match('foo', {}); }, /unmatched/i);
        });
        
        it('should fail if no match is found, and there is no default', () => {
            assert.throws(() => {
                match('nonexistent', {
                    foo: 42,
                    bar: 'hello',
                });
            }, /unmatched/i);
        });
        
        it('should select default case if no match is found, and `match.default` is present', () => {
            const result = match('nonexistent', {
                [match.default]: true,
                x: false,
                y: false,
            });
            assert.strictEqual(result, true);
        });
        
        it('should return the matched case result if a match is found', () => {
            const result = match('bar', {
                foo: 42,
                bar: 'hello',
                baz: null,
            });
            assert.strictEqual(result, 'hello');
        });
        
        it('should allow numeric tags', () => {
            const result = match(42, {
                41: 'foo',
                42: 'bar',
                43: 'baz',
            });
            assert.strictEqual(result, 'bar');
        });
        
        it('should allow symbolic tags', () => {
            const symbol1 = Symbol('symbol1');
            const symbol2 = Symbol('symbol2');
            const symbol3 = Symbol('symbol3');
            
            const result = match(symbol2, {
                [symbol1]: 'foo',
                [symbol2]: 'bar',
                [symbol3]: 'baz',
            });
            assert.strictEqual(result, 'bar');
        });
        
        it('should allow `match.default` as a tag to select the default explicitly', () => {
            const result = match(match.default, {
                foo: 42,
                [match.default]: 'hello',
                baz: null,
            });
            assert.strictEqual(result, 'hello');
        });
        
        it('should allow defining a case as a function, which takes the tag as input', () => {
            const result = match('foo', {
                foo: tag => `${tag}!`,
                bar: 42,
            });
            assert.strictEqual(result, 'foo!');
        });
        
        it('should allow function callback for `match.default` as well', () => {
            const result = match('nonexistent', {
                [match.default]: tag => `${tag}#`,
                foo: tag => `${tag}!`,
                bar: 42,
            });
            assert.strictEqual(result, 'nonexistent#');
        });
        
        it('should explicitly disallow __proto__ as a possible tag', () => {
            assert.throws(() => {
                match('__proto__', {
                    [match.default]: true,
                    foo: 'hello',
                    bar: 42,
                });
            }, /__proto__/);
        });
    });
    
    describe('matchType', () => {
        it('should fail on lack of subject argument', () => {
            assert.throws(() => { matchType(); }, TypeError);
        });
        
        it('should fail on lack of case map argument', () => {
            assert.throws(() => { matchType({ type: 'foo' }); }, TypeError);
        });
        
        it('should fail if given an invalid type', () => {
            [undefined, null, true, { x: 'hello' }, new Date()].forEach(typeInvalid => {
                assert.throws(() => { matchType({ type: typeInvalid }, { foo: 42 }); }, TypeError);
            });
        });
        
        it('should fail if given an invalid case map', () => {
            [undefined, null, true].forEach(casesInvalid => {
                assert.throws(() => { matchType({ type: 'foo' }, casesInvalid); }, TypeError);
            });
        });
        
        it('should fail as unmatched if given an empty case map', () => {
            assert.throws(() => { matchType({ type: 'foo' }, {}); }, /unmatched/i);
        });
        
        it('should fail if no match is found, and there is no default', () => {
            assert.throws(() => {
                matchType({ type: 'nonexistent' }, {
                    foo: 42,
                    bar: 'hello',
                });
            }, /unmatched/i);
        });
        
        it('should select default case if no match is found, and `match.default` is present', () => {
            const result = matchType({ type: 'nonexistent' }, {
                [match.default]: true,
                x: false,
                y: false,
            });
            assert.strictEqual(result, true);
        });
        
        it('should return the matched case result if a match is found', () => {
            const result = matchType({ type: 'bar' }, {
                foo: 42,
                bar: 'hello',
                baz: null,
            });
            assert.strictEqual(result, 'hello');
        });
        
        it('should allow numeric types', () => {
            const result = matchType({ type: 42 }, {
                41: 'foo',
                42: 'bar',
                43: 'baz',
            });
            assert.strictEqual(result, 'bar');
        });
        
        it('should allow symbolic types', () => {
            const symbol1 = Symbol('symbol1');
            const symbol2 = Symbol('symbol2');
            const symbol3 = Symbol('symbol3');
            
            const result = matchType({ type: symbol2 }, {
                [symbol1]: 'foo',
                [symbol2]: 'bar',
                [symbol3]: 'baz',
            });
            assert.strictEqual(result, 'bar');
        });
        
        it('should allow `match.default` as a type to select the default explicitly', () => {
            const result = matchType({ type: match.default }, {
                foo: 42,
                [match.default]: 'hello',
                baz: null,
            });
            assert.strictEqual(result, 'hello');
        });
        
        it('should allow defining a case as a function, which takes the entire subject as input', () => {
            const result = matchType({ type: 'foo', message: 'hello' }, {
                foo: subject => `${subject.message}!`,
                bar: 42,
            });
            assert.strictEqual(result, 'hello!');
        });
        
        it('should allow function callback for `match.default` as well', () => {
            const result = matchType({ type: 'nonexistent', message: 'hello' }, {
                [match.default]: subject => `${subject.message}#`,
                foo: subject => `${subject.message}!`,
                bar: 42,
            });
            assert.strictEqual(result, 'hello#');
        });
        
        it('should explicitly disallow __proto__ as a possible type', () => {
            assert.throws(() => {
                matchType({ type: '__proto__' }, {
                    [match.default]: true,
                    foo: 'hello',
                    bar: 42,
                });
            }, /__proto__/);
        });
    });
    
    describe('matchSingleKey', () => {
        it('should fail on lack of subject argument', () => {
            assert.throws(() => { matchSingleKey(); }, TypeError);
        });
        
        it('should fail on lack of case map argument', () => {
            assert.throws(() => { matchSingleKey({ foo: null }); }, TypeError);
        });
        
        it('should fail if not given an object', () => {
            [undefined, null, true, { x: 'hello' }, new Date()].forEach(subjectInvalid => {
                assert.throws(() => { matchType(subjectInvalid, { foo: 42 }); }, TypeError);
            });
        });
        
        it('should fail if given an object but not with a single key', () => {
            [{}, { x: 42, y: 43 }].forEach(subjectInvalid => {
                assert.throws(() => { matchType(subjectInvalid, { foo: 42 }); }, TypeError);
            });
        });
        
        it('should fail if given an invalid case map', () => {
            [undefined, null, true].forEach(casesInvalid => {
                assert.throws(() => { matchSingleKey({ foo: null }, casesInvalid); }, TypeError);
            });
        });
        
        it('should fail as unmatched if given an empty case map', () => {
            assert.throws(() => { matchSingleKey({ foo: null }, {}); }, /unmatched/i);
        });
        
        it('should fail if no match is found, and there is no default', () => {
            assert.throws(() => {
                matchSingleKey({ nonexistent: null }, {
                    foo: 42,
                    bar: 'hello',
                });
            }, /unmatched/i);
        });
        
        it('should select default case if no match is found, and `match.default` is present', () => {
            const result = matchSingleKey({ nonexistent: null }, {
                [match.default]: true,
                x: false,
                y: false,
            });
            assert.strictEqual(result, true);
        });
        
        it('should return the matched case result if a match is found', () => {
            const result = matchSingleKey({ bar: null }, {
                foo: 42,
                bar: 'hello',
                baz: null,
            });
            assert.strictEqual(result, 'hello');
        });
        
        it('should allow numeric keys', () => {
            const result = matchSingleKey({ 42: null }, {
                41: 'foo',
                42: 'bar',
                43: 'baz',
            });
            assert.strictEqual(result, 'bar');
        });
        
        it('should not respect symbolic keys', () => {
            // Symbol keys are not considered as keys, to allow them to be used for other purposes instead
            // (e.g. well-known symbols, extension mechanism, etc.).
            
            const symbol1 = Symbol('symbol1');
            const symbol2 = Symbol('symbol2');
            const symbol3 = Symbol('symbol3');
            
            assert.throws(() => {
                matchSingleKey({ [symbol2]: null }, {
                    [symbol1]: 'foo',
                    [symbol2]: 'bar',
                    [symbol3]: 'baz',
                });
            }, /expected an object with a single key/i);
        });
        
        it('should not allow `match.default` as a key to select the default explicitly', () => {
            assert.throws(() => {
                matchSingleKey({ [match.default]: null }, {
                    foo: 42,
                    [match.default]: 'hello',
                    baz: null,
                });
            }, /expected an object with a single key/i);
        });
        
        it('should allow defining a case as a function, which takes the single property value as input', () => {
            const result = matchSingleKey({ foo: 'hello' }, {
                foo: subject => `${subject}!`,
                bar: 42,
            });
            assert.strictEqual(result, 'hello!');
        });
        
        it('should allow function callback for `match.default` as well', () => {
            const result = matchSingleKey({ nonexistent: 'hello' }, {
                [match.default]: subject => `${subject}#`,
                foo: subject => `${subject}!`,
                bar: 42,
            });
            assert.strictEqual(result, 'hello#');
        });
        
        it('should explicitly disallow __proto__ as a possible type', () => {
            // Note: there should be no way to create an object where the `__proto__` property is enumerable,
            // because the property is non-enumerable by default and it is not configurable.
            // Thus creating a subject where `__proto__` is the single key should be impossible.
            
            assert(true);
        });
    });
    
    describe('matcher', () => {
        it('should fail on lack of parser argument', () => {
            assert.throws(() => { matcher(); }, TypeError);
        });
        
        it('should fail when parser is not a function', () => {
            [null, true].forEach(parserInvalid => {
                assert.throws(() => { matcher(parserInvalid); }, TypeError);
            });
        });
        
        it('should return the corresponding match function', () => {
            const customMatch = matcher(subject => ({ tag: subject.tag, body: subject }));
            
            assert.strictEqual(typeof customMatch, 'function');
            
            const result = customMatch({ tag: 'foo' }, {
                foo: 42,
                bar: 'hello',
            });
            
            assert.strictEqual(result, 42);
        });
        
        it('should support default case', () => {
            const customMatch = matcher(subject => ({ tag: subject.tag, body: subject }));
            
            const result = customMatch({ tag: 'nonexistent' }, {
                foo: 42,
                bar: 'hello',
                [customMatch.default]: true,
            });
            
            assert.strictEqual(result, true);
        });
        
        it('should pass in the body as argument to callback functions', () => {
            const customMatch = matcher(subject => ({ tag: subject.tag, body: 'body' }));
            
            const result = customMatch({ tag: 'foo' }, {
                foo: body => `${body}!`,
                bar: 'hello',
                [customMatch.default]: true,
            });
            
            assert.strictEqual(result, 'body!');
        });
        
        it('should explicitly disallow __proto__ as a possible tag', () => {
            const customMatch = matcher(subject => ({ tag: subject.tag, body: 'body' }));
            
            assert.throws(() => {
                matchType({ tag: '__proto__' }, {
                    [match.default]: true,
                    foo: 'hello',
                    bar: 42,
                });
            }, /__proto__/);
        });
    });
});
