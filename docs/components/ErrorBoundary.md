## [ErrorBoundary](src/components/error-boundary/ErrorBoundary.tsx)
A React ErrorBoundary that will catch any errors during render for its children.
In case of an error it will display a customizable fallback.
Any part of your application outside the error boundary will still be functional if a component inside the error boundary crashed.

It logs the error using the chayns-logger including the component stack trace.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| children | The elements that should be wrapped | ReactNode | required |
| fallback | A react component that should be rendered as fallback. Receives the error as props.error | JSXElementConstructor | A warning content card with a generic error message and reload button |

### ErrorBoundary.wrap(WrappedComponent, fallback)
Static function that works High-Order-Component to wrap a component in an error boundary like you would with React.memo().
Effectively this is a shorthand to always wrap a certain component in an error boundary

| Parameter | Description | Type | Required/Default |
|------|-------------|------|------------------|
| WrappedComponent | The component that should be wrapped | JSXElementConstructor | required |
| fallback | A react component that should be rendered as fallback. Receives the error as props.error | JSXElementConstructor | A warning content card with a generic error message and reload button |

### Examples
* Basic use case
```jsx
// it's a good idea to wrap your entire application in an error boundary
<ErrorBoundary>
    <App/>
</ErrorBoundary>
```
* Custom fallback
```jsx
const Fallback = ({ error }) => {
    return <div>An error occurred: {error.toString()}</div>
}

<ErrorBoundary fallback={Fallback}>
    <App/>
</ErrorBoundary>
```
* ErrorBoundary.wrap
```jsx
const MyComponent = (props) => {
    // ...
}

export default ErrorBoundary.wrap(MyComponent);
```
