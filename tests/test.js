
const assert = require('assert');
const match = require('../src/match.js');

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
            
            it('should fail if no match is found, and there is no [match.default]', function() {
                assert.throws(() => {
                    match('foo', {
                        x: false,
                        y: false,
                    });
                });
            });
            
            it('should select [match.default] if no match is found', function() {
                const actual = match('foo', {
                    x: false,
                    y: false,
                    [match.default]: true,
                });
                assert.strictEqual(actual, true);
            });
        });
    });
});
