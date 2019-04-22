
const assert = require('assert');
const { match, matchType, matchSingleKey } = require('../src/match.js');

describe('match.js', () => {
    describe('match', () => {
        it('should fail on lack of match subject', () => {
            assert.throws(() => { match(); });
        });
        
        it('should fail on lack of match cases', () => {
            assert.throws(() => { match('foo'); });
        });
        
        describe('cases through plain object', () => {
            it('should fail on lack of cases', () => {
                assert.throws(() => { match('foo', {}); });
            });
            
            it('should match string subject with property name', () => {
                const actual = match('foo', {
                    foo: true,
                    bar: false,
                });
                assert.strictEqual(actual, true);
            });
            
            it('should fail if no match is found, and there is no `match.default`', () => {
                assert.throws(() => {
                    match('unmatched', {
                        x: false,
                        y: false,
                    });
                });
            });
            
            it('should select `match.default` if no match is found', () => {
                const actual = match('unmatched', {
                    x: false,
                    y: false,
                    [match.default]: true,
                });
                assert.strictEqual(actual, true);
            });
            
            it('should pass the subject as body to any function', () => {
                const actual = match('foo', {
                    foo: subject => subject,
                });
                assert.strictEqual(actual, 'foo');
            });
        });
        
        describe('cases through predicate list', () => {
            it('should fail on lack of predicates', () => {
                assert.throws(() => { match('foo', []); });
            });
            
            it('should perform structural match on object given as predicate', () => {
                const actual = match({ type: 'x' }, [
                    match.case({ type: 'x' }, true),
                    match.case({ type: 'y' }, false),
                ]);
                assert.strictEqual(actual, true);
            });
            
            it('should apply a function predicate with the subject body as argument', () => {
                const actual = match('foo', [
                    match.case(x => x === 'bar', false),
                    match.case(x => x === 'foo', true),
                ]);
                assert.strictEqual(actual, true);
            });
            
            it('should fail if no match is found, and there is no `match.otherwise`', () => {
                assert.throws(() => {
                    const actual = match('unmatched', [
                        match.case(x => x === 'foo', true),
                        match.case(x => x === 'bar', false),
                    ]);
                });
            });
            
            it('should select `match.otherwise` if no match is found', () => {
                const actual = match('unmatched', [
                    match.case(x => x === 'foo', false),
                    match.case(x => x === 'bar', false),
                    match.otherwise(true),
                ]);
                assert.strictEqual(actual, true);
            });
        });
    });
    
    describe('matchType', () => {
        it('should fail if subject is non-object', () => {
            assert.throws(() => { matchType(42); });
        });
        
        it('should fail if subject does not have a `type` property', () => {
            assert.throws(() => { matchType({ notType: 42 }); });
        });
        
        it('should use type to match on a case object', () => {
            const actual = matchType({ type: 'y' }, {
                x: false,
                y: true,
                [match.default]: false,
            });
            assert.strictEqual(actual, true);
        });
        
        it('should pass the entire object to functions', () => {
            const actual = matchType({ type: 'y', value: 42 }, {
                x: false,
                y: ({ type, value }) => ({ type, value }),
                [match.default]: false,
            });
            assert.deepStrictEqual(actual, { type: 'y', value: 42 });
        });
        
        it('should work with predicates', () => {
            const actual = matchType({ type: 'y', value: 42 }, [
                match.case(type => type === 'x', false),
                match.case(type => type === 'y', ({ value }) => value),
                match.otherwise(false),
            ]);
            assert.deepStrictEqual(actual, 42);
        });
    });
    
    describe('matchSingleKey', () => {
        it('should fail if subject is non-object', () => {
            assert.throws(() => { matchSingleKey(42); });
        });
        
        it('should fail if subject does not have exactly one property', () => {
            assert.throws(() => { matchSingleKey({}); });
            assert.throws(() => { matchSingleKey({ x: null, y: null }); });
        });
        
        it('should use single key to match on a case object', () => {
            const actual = matchSingleKey({ y: 42 }, {
                x: false,
                y: true,
                [match.default]: false,
            });
            assert.strictEqual(actual, true);
        });
        
        it('should pass just the property value to functions', () => {
            const actual = matchSingleKey({ y: 42 }, {
                x: false,
                y: value => value,
                [match.default]: false,
            });
            assert.deepStrictEqual(actual, 42);
        });
        
        it('should work with predicates', () => {
            const actual = matchSingleKey({ y: { value: 42 } }, [
                match.case(key => key === 'x', false),
                match.case(key => key === 'y', ({ value }) => value),
                match.otherwise(false),
            ]);
            assert.deepStrictEqual(actual, 42);
        });
    });
});
