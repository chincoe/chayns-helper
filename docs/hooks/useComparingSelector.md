## [useComparingSelector](src/hooks/useComparingSelector.ts)
A wrapper for the react-redux `useSelector` hook that automatically adds an equality function to prevent unnecessary rerenders.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| selector | a selector function like one would pass to `useSelector` | (any) => any | required |
| deep | Switch between shallowEqual and deepEqual, which will compare all levels of nesting recursively but comes at a potential performance cost | boolean | `false`(shallowEqual) |
| **@returns** | The value returned by the selector function | any |

### Examples
```javascript
const value = useComparingSelector(state => state.slice.value);
const value = useComparingSelector(state => state.slice.value, true); // deep equality
```
