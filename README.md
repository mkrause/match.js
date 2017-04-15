
# match.js

JavaScript matching utility. Allows you to branch on a value using a list of different possible cases.


## Usage

The `match` function takes a value, and a list of cases, and returns either the first case that matches, or an exception otherwise.

```js
    import match from '@mkrause/match'; // If using ES6 modules
    const { match } = require('@mkrause/match'); // If using ES5
    
    match(<value>, <case-list>);
```

The case list can be specified in one of two ways. If the value is a string (or if we're using a custom matcher, see below) then we can use an object where the value is matched against each property name.

```js
    const result = match('foo', {
        foo: 42,
        bar: 43,
    });
    result === 42;
```

Alternatively, we can specify a list of predicates (functions) using `match.case(<predicate>, <result>)`. Each predicate is given the value and should return a boolean indicating whether there is a match.

```js
    const result = match({ position: 42 }, [
        match.case(x => x.position > 0, +1),
        match.case(x => x.position == 0, 0),
        match.case(x => x.position < 0, -1),
    ]);
    result === 1;
```

A case result can be either a plain value, or a function:

```js
    const result = match('apple', {
        apple: () => processApple(),
        orange: () => processOrange(),
    });
```

A default case can be specified as fallback. With an object as case list, a special symbol `match.default` is available which can be used as unambiguous property name. With a case list, use `match.otherwise`.

```js
    const result = match('pear', {
        apple: () => processApple(),
        orange: () => processOrange(),
        [match.default]: fruitType => processOther(fruitType),
    });
    
    const result = match({ color: 'yellow' }, [
        match.case(({ color }) => color === 'red', 0xff0000),
        match.case(({ color }) => color === 'green', 0x00ff00),
        match.case(({ color }) => color === 'blue', 0x0000ff),
        match.otherwise('unknown color!'),
    ]);
```

If no case matches, and no fallback is given, an exception is thrown.


## Custom match semantics

You can create your own custom `match` function. For example, let's say our React/Redux/Flux application makes use of actions that conform to the [Flux Standard Action (FSA)](https://github.com/acdlite/flux-standard-action) protocol. We could create a matcher as follows:

```js
    import { matcher } from '@mkrause/match';
    
    const match = matcher(subject => {
        return { discriminator: subject.type, body: subject };
    });
    
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
    import { matchType, matchSingleKey } from '@mkrause/match';
    
    const action = { type: 'CREATE_USER', error: false, payload: { name: 'John' } };
    matchType(action, {
        CREATE_USER: ({ error, payload }) => doSomethingWith(payload),
    });
    
    matchSingleKey({ CREATE_USER: { name: 'John' } }, {
        CREATE_USER: user => doSomethingWith(user),
    });
```


## Similar libraries

- https://github.com/LestaD/match.js
- https://github.com/eddieantonio/single-key
- https://github.com/FGRibreau/match-when
