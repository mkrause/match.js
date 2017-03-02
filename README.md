
# match.js

Basic JavaScript pattern matching utility.


## Usage

Using an object:

```js
    const { match } = require('@mkrause/match.js');
    const result = match('foo', {
        foo: 42,
        bar: 43,
    });
    result === true;
```

Using a predicate list:

```js
    const { match } = require('@mkrause/match.js');
    const result = match('foo', {
        foo: 42,
        bar: 43,
    });
    result === true;
```


## Custom match semantics

You can create your own custom `match` function. For example, let's say our React/Redux/Flux application makes use of actions that conform to the [Flux Standard Action (FSA)](https://github.com/acdlite/flux-standard-action) protocol. We could create a matcher as follows:

```js
    const { matcher } = require('@mkrause/match.js');
    
    const match = matcher(subject => {
        return { discriminator: subject.type, body: subject };
    });
    
    const action = { type: 'CREATE_USER', payload: { name: 'John' } };
    const result = match(action, {
        CREATE_USER: () => { /* ... */ },
    });
```

We supply a couple of common matchers out of the box:

- `match`: generic matcher
- `matchType`: match on objects with a `type` property
- `matchSingleKey`: match on objects with a single property, e.g. `{ MY_TYPE: { value: 42 } }`


## Similar libraries

- https://github.com/LestaD/match.js
- https://github.com/eddieantonio/single-key
- https://github.com/FGRibreau/match-when
