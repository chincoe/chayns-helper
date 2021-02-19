## [usePreviousEffect](src/hooks/usePreviousEffect.ts)
A useEffect hook that passes the values its dependencies had in the previous render.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| effect | a useEffect effect function, but receives the previous values of its dependency array as parameter| (prev: Array<any>) => any | required |
| deps | the dependencies | Array<any> | `undefined` |

### Examples
```javascript
usePreviousEffect(([prevVal1, prevVal2, prevVal3]) => {
    // use the previoius values
}, [val1, val2, val3]);
```
