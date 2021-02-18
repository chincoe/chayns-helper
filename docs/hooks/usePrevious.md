## [usePrevious](src/hooks/usePrevious.ts)
Retain a value from a previous render.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| value | the value you want to keep | any | required |
| deps | the dependencies for updating the value | Array<any> | `undefined` |
| **@returns** | The value from the previous render or change of dependencies | |

### Examples
```javascript
const prevValue = usePrevious(value); // keep value from previous render
const prevValue = usePrevious(value, [value]); // keep value the variable had previous to the current one
const prevValue = usePrevous(value, [dep]); // keep the value from before the previous change of `dep`
```
