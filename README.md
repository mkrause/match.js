
# case-match

[![npm](https://img.shields.io/npm/v/case-match.svg)](https://www.npmjs.com/package/case-match)
[![GitHub Actions](https://github.com/mkrause/match.js/actions/workflows/nodejs.yml/badge.svg)](https://github.com/mkrause/match.js/actions)
[![MIT](https://img.shields.io/npm/l/case-match)](https://github.com/mkrause/match.js)
[![Types](https://img.shields.io/npm/types/case-match)](https://github.com/mkrause/match.js)

JavaScript case matching utility. With TypeScript support.


## Usage

The `match` function takes a value, and a list of cases, and returns either the first case that matches, or an exception otherwise.

```js
import match from 'case-match';

const type = 'foo';
const result = match(type, {
    foo: 42,
    bar: 43,
    baz: 44,
});
result === 42;
```

A case result can be either a plain value, or a function:

```js
const fruit = 'orange';
const result = match(fruit, {
    apple: 'Apple Pie',
    orange: () => 'Orange Juice',
});
result === 'Orange Juice';
```

A default case can be specified as fallback. A special symbol `match.default` is available to use as the key for the default case.

```js
const fruit = 'pear';
const result = match(fruit, {
    apple: 'Apple Pie',
    orange: 'Orange Juice',
    [match.default]: fruit => processOther(fruit),
});
```

If no case matches, and no fallback is given, an exception is thrown.


## Custom match semantics

You can create your own custom `match` function. For example, let's say we have a React application that makes use of actions that conform to the [Flux Standard Action (FSA)](https://github.com/acdlite/flux-standard-action) protocol. We could create a matcher as follows:

```js
import { matcher } from 'case-match';

const match = matcher(subject => ({
    discriminator: subject.type,
    body: subject,
}));

const action = { type: 'CREATE_USER', error: false, payload: { name: 'John' } };
const result = match(action, {
    CREATE_USER: ({ error, payload }) => doSomethingWith(payload),
});
```

We supply a couple of common matchers out of the box:

- `match`: generic matcher
- `matchType`: match on objects with a `type` property
- `matchSingleKey`: match on objects with a single property, e.g. `{ MY_TYPE: { value: 42 } }`

```js
import { matchType, matchSingleKey } from 'case-match';

const action = { type: 'CREATE_USER', error: false, payload: { name: 'John' } };
matchType(action, {
    CREATE_USER: ({ error, payload }) => doSomethingWith(payload),
});

matchSingleKey({ CREATE_USER: { name: 'John' } }, {
    CREATE_USER: user => doSomethingWith(user),
});
```


## Similar libraries

- https://github.com/gvergnaud/ts-pattern
- https://github.com/LestaD/match.js
- https://github.com/eddieantonio/single-key
- https://github.com/FGRibreau/match-when
