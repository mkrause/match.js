
const assert = require('assert');
const { match, matchType, matchSingleKey } = require('../src/match.js');

describe('match.js', function() {
    describe('match', function() {
        it('should fail on lack of match subject', function() {
            assert.throws(() => { match(); });
        });
        
        it('should fail on lack of match cases', function() {
            assert.throws(() => { match('foo'); });
        });
        
        describe('cases through plain object', function() {
            it('should fail on lack of cases', function() {
                assert.throws(() => { match('foo', {}); });
            });
            
            it('should match string subject with property name', function() {
                const actual = match('foo', {
                    foo: true,
                    bar: false,
                });
                assert.strictEqual(actual, true);
            });
            
            it('should fail if no match is found, and there is no `match.default`', function() {
                assert.throws(() => {
                    match('unmatched', {
                        x: false,
                        y: false,
                    });
                });
            });
            
            it('should select `match.default` if no match is found', function() {
                const actual = match('unmatched', {
                    x: false,
                    y: false,
                    [match.default]: true,
                });
                assert.strictEqual(actual, true);
            });
            
            it('should pass the subject as body to any function', function() {
                const actual = match('foo', {
                    foo: subject => subject,
                });
                assert.strictEqual(actual, 'foo');
            });
        });
        
        describe('cases through predicate list', function() {
            it('should fail on lack of predicates', function() {
                assert.throws(() => { match('foo', []); });
            });
            
            it('should perform structural match on object given as predicate', function() {
                const actual = match({ type: 'x' }, [
                    match.case({ type: 'x' }, true),
                    match.case({ type: 'y' }, false),
                ]);
                assert.strictEqual(actual, true);
            });
            
            it('should apply a function predicate with the subject body as argument', function() {
                const actual = match('foo', [
                    match.case(x => x === 'bar', false),
                    match.case(x => x === 'foo', true),
                ]);
                assert.strictEqual(actual, true);
            });
            
            it('should fail if no match is found, and there is no `match.otherwise`', function() {
                assert.throws(() => {
                    const actual = match('unmatched', [
                        match.case(x => x === 'foo', true),
                        match.case(x => x === 'bar', false),
                    ]);
                });
            });
            
            it('should select `match.otherwise` if no match is found', function() {
                const actual = match('unmatched', [
                    match.case(x => x === 'foo', false),
                    match.case(x => x === 'bar', false),
                    match.otherwise(true),
                ]);
                assert.strictEqual(actual, true);
            });
        });
    });
    
    describe('matchType', function() {
        it('should fail if subject is non-object', function() {
            assert.throws(() => { matchType(42); });
        });
        
        it('should fail if subject does not have a `type` property', function() {
            assert.throws(() => { matchType({ notType: 42 }); });
        });
        
        it('should use type to match on a case object', function() {
            const actual = matchType({ type: 'y' }, {
                x: false,
                y: true,
                [match.default]: false,
            });
            assert.strictEqual(actual, true);
        });
        
        it('should pass the entire object to functions', function() {
            const actual = matchType({ type: 'y', value: 42 }, {
                x: false,
                y: ({ type, value }) => ({ type, value }),
                [match.default]: false,
            });
            assert.deepStrictEqual(actual, { type: 'y', value: 42 });
        });
        
        it('should work with predicates', function() {
            const actual = matchType({ type: 'y', value: 42 }, [
                match.case(type => type === 'x', false),
                match.case(type => type === 'y', ({ value }) => value),
                match.otherwise(false),
            ]);
            assert.deepStrictEqual(actual, 42);
        });
    });
    
    describe('matchSingleKey', function() {
        it('should fail if subject is non-object', function() {
            assert.throws(() => { matchSingleKey(42); });
        });
        
        it('should fail if subject does not have exactly one property', function() {
            assert.throws(() => { matchSingleKey({}); });
            assert.throws(() => { matchSingleKey({ x: null, y: null }); });
        });
        
        it('should use single key to match on a case object', function() {
            const actual = matchSingleKey({ y: 42 }, {
                x: false,
                y: true,
                [match.default]: false,
            });
            assert.strictEqual(actual, true);
        });
        
        it('should pass just the property value to functions', function() {
            const actual = matchSingleKey({ y: 42 }, {
                x: false,
                y: value => value,
                [match.default]: false,
            });
            assert.deepStrictEqual(actual, 42);
        });
        
        it('should work with predicates', function() {
            const actual = matchSingleKey({ y: { value: 42 } }, [
                match.case(key => key === 'x', false),
                match.case(key => key === 'y', ({ value }) => value),
                match.otherwise(false),
            ]);
            assert.deepStrictEqual(actual, 42);
        });
    });
});
