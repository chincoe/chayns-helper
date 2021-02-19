## [getHookState](src/functions/getHookState.ts)

Get the current state of a React useState hook using the setter. This helper can still extract the current value in
cases where only a previous version of the state itself is available (e.g. in an event listener).

| Parameter     | Description          | Type | Default / required |
|---------------|----------------------|------|-----------|
| setter | The setter of a React useState hook | function | required |
| **@returns** | A promise of the current value | Promise<T> | |

### Examples
```jsx
const [state, setState] = useState(0);
useEffect(() => {
    document.addEventListener('click', () => {
        getHookState(setState).then(console.log); // logs the current state, even if it has been modified
    })
}, []) 
```
