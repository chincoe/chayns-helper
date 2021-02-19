## [rerender](src/components/rerender/rerender.tsx)
A High-Order-Component that supplies function components with the ability to rerender themselves by adding a `rerenderSelf()` function to the props.

| Parameter | Description | Type | Required/Default |
|------|-------------|------|------------------|
| WrappedComponent | The component that should be receive the `rerenderSelf` prop | JSXElementConstructor | required |

### Examples
```jsx
const MyComponent = ({ rerenderSelf }) => {
    return (
        <Button onClick={rerenderSelf}>
            Rerender
        </Button>
    );
}

export default rerender(MyComponent);
```
