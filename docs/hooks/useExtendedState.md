## [useExtendedState](src/hooks/useExtendedState.ts)

A wrapper for the React useState hook that extends the state with a prev state and a function that gets the actual
current state from anywhere.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| initialState | the initial state | T | required |
| deps | a dependency array to customize the update of the previous state. Always updates prev state if the state updates | Array<any> | `[]` |
| **@returns** | `[state, setState, getState, prevState]` | [T, (v: T) => void, () => Promise<T>, T] | |

#### Return values
1. state: the current state
2. setState: the state setter
3. getState: a function that gets the actual current state asynchronously
4. prevState: a state from a previous render, usually the previous value of the state. Modify the `deps` parameter to update this value when other values change.

### Examples
```javascript
const [state, setState, getState, prevState] = useExtendedState(0); // => state = 0, prevState = undefined

const fn1 = () => state;
const fn2 = () => getState();

setState(1); // state is now 1

fn1(); // => 0
await fn2(); // => 1
```

