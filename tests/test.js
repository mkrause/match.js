
import assert from 'assert';
import match, { matcher, matchType } from '../src/match.js';


describe('match.js', () => {
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
        
        it('should allow numeric keys', () => {
            const result = match(42, {
                41: 'foo',
                42: 'bar',
                43: 'baz',
            });
            assert.strictEqual(result, 'bar');
        });
        
        it('should allow symbolic keys', () => {
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
    });
});
