## [refresh](src/components/rerender/refresh.tsx)
A High-Order-Component that rerenders the specific component in a certain interval

| Parameter | Description | Type | Required/Default |
|------|-------------|------|------------------|
| WrappedComponent | The component that should be rerendered | JSXElementConstructor | required |
| interval | rerender interval in ms | number | `10000` |

### Example
```jsx
const MyComponent = (props) => {
    // ...
}
// rerender MyComponent every second
export default refresh(MyComponent, 1000);
```
