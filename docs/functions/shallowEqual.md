## [shallowEqual](src/functions/shallowEqual.ts)
React-Redux' shallowEqual function that checks 2 values or objects for shallow equality.
Checks for equal values on first level, only compares members of reference types properties by reference.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| objA | first parameter to be compared | any | required |
| objB | second parameter to be compared | any | required |
| **@returns** | values are equal | boolean | |

### Examples
```javascript
const arr = [1, 2, 3];
let areEqual = shallowEqual({ foo: 1, bar: arr }, { foo: 1, bar: arr }); // => true
areEqual = shallowEqual({ foo: 1, bar: [1, 2, 3] }, { foo: 1, bar: [1, 2, 3] }); // => false because array refence is different
```

## deepEqual
React-Redux' shallowEqual function that checks 2 values or objects for deep equality.
Checks for equal values on all levels recursively at the cost of lower performance.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| objA | first parameter to be compared | any | required |
| objB | second parameter to be compared | any | required |
| **@returns** | values are equal | boolean | |

### Examples
```javascript
const arr = [1, 2, 3];
let areEqual = shallowEqual({ foo: 1, bar: arr }, { foo: 1, bar: arr }); // => true
areEqual = shallowEqual({ foo: 1, bar: [1, 2, 3] }, { foo: 1, bar: [1, 2, 3] }); // => true
```
