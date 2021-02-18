## [useUpdateEffect](src/hooks/useUpdateEffect.ts)
A useEffect that does not run on the first render

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| effect | the effect function | function | required |
| deps | the dependency array | Array<any> | not required |

### Examples
```javascript
useUpdateEffect(() => {
    // run every time state is updated, but not on the first render
}, [state])
```
