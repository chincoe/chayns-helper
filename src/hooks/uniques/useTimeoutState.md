## [useTimeoutState](useTimeoutState.js)
A debounced useState hook.
Executes an onChange method when the state has not been modified for a short timeout.

| Parameter | Description | Type | Default/required |
|--------|--------------|-----------|-------------|
|initialValue| useState initial value | * | undefined |
|onChange| function to be called when the state has not changed for a timeout | function(state) | required |
|timeout| timeout in ms after which onChange will be called | number | `500` |
| **@returns** | `[state, setState]` | [\*, function(\*)] | |

#### Example
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
