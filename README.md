
# match.js

JavaScript pattern matching utility.


## Usage

Using an object:

```js
    const { match } = require('@mkrause/match');
    const result = match('foo', {
        foo: 42,
        bar: 43,
    });
    result === 42;
```

Using a predicate list:

```js
    const { match } = require('@mkrause/match');
    const result = match({ value: 42 }, [
        match.case(({ value }) => value > 0, +1),
        match.case(({ value }) => value == 0, 0),
        match.case(({ value }) => value < 0, -1),
    ]);
    result === 1;
```


## Custom match semantics

You can create your own custom `match` function. For example, let's say our React/Redux/Flux application makes use of actions that conform to the [Flux Standard Action (FSA)](https://github.com/acdlite/flux-standard-action) protocol. We could create a matcher as follows:

```js
    const { matcher } = require('@mkrause/match');
    
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
    const { matchType, matchSingleKey } = require('@mkrause/match');
    
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
