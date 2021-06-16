## [useTimeoutState](src/hooks/uniques/useTimeoutState.ts)
A debounced useState hook.
Executes an onChange method when the state has not been modified for a short timeout.

| Parameter | Description | Type | Default/required |
|--------|--------------|-----------|-------------|
|initialValue| useState initial value | T | `undefined` |
|onChange| function to be called when the state has not changed for a timeout | (currentValue: T) => void | required |
|timeout| timeout in ms after which onChange will be called | number | `500` |
|equalityFn | Override the default function to check equality. If the new value equals the previous value, onChange will not be triggered | (newValue, oldValue) => boolean | `undefined` |
| **@returns** | `[state, setState]` | [T, function(T)] | |

### Examples
```javascript
const [value, setValue] = useTimeoutState('', (state) => { dispatch(sendData(state)) });
// ....
return (
    <Input
        value={value}
        onChange={setValue}
    />         
)
```
## [useUniqueTimeout](src/hooks/uniques/useUniqueTimeout.ts)
A setTimeout wrapper that clears the previous timeout if called again.

| Parameter | Description | Type | Default/required |
|--------|--------------|-----------|-------------|
| initialValue | An initial value, possibly the first timeout | number/NodeJs.Timeout | `0` |
| **@returns** | `[setUniqueTimeout, replaceTimeout]` | [(callback: function, timeout: number) => NodeJS.Timeout, (timeout: NodeJS.Timeout) => NodeJS.Timeout] | |

### Examples
```javascript
const [setUniqueTimeout, replaceUniqueTimeout] = useUniqueTimeout();
// these 2 calls do exactly the same thing. The second function is only returned for using this helper with pre-existing timeouts
const myTimeout = setUniqueTimeout(() => { console.log('A second has passed') }, 1000);
const myTimeout = replaceUniqueTimeout(setTimeout(() => { console.log('A second has passed') }, 1000));
```

## [useUniqueInterval](src/hooks/uniques/useUniqueInterval.ts)
A setInterval wrapper that clears the previous interval if called again.

| Parameter | Description | Type | Default/required |
|--------|--------------|-----------|-------------|
| initialValue | An initial value, possibly the first interval | number/NodeJs.Timeout | `0` |
| **@returns** | `[setUniqueInterval, replaceinterval]` | [(callback: function, interval: number) => NodeJS.Timeout, (interval: NodeJS.Timeout) => NodeJS.Timeout] | |

### Examples
```javascript
const [setUniqueInterval, replaceUniqueInterval] = useUniqueInterval();
// these 2 calls do exactly the same thing. The second function is only returned for using this helper with pre-existing intervals
const myTimeout = setUniqueInterval(() => { console.log('A second has passed') }, 1000);
const myTimeout = replaceUniqueInterval(setInterval(() => { console.log('A second has passed') }, 1000));
```
