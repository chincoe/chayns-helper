## [RefreshComponent](src/components/rerender/RefreshComponent.tsx)
A component that rerenders its children in an interval.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| children | The children to be rerendered | ReactNode | required |
| interval | the rerender interval in ms | number | `10000` | 
| elementType | The react element to use as container | string/JSXElementConstructor | `'div'` |
| ...props | All other props will be directly applied to the container element | | |

### Example
```jsx
// Render the current date, refreshing it every second
<RefreshComponent interval={1000}>
    {new Date().toISOString()}
</RefreshComponent>
```
