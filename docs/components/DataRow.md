## [DataRow](src/components/containers/DataRow.tsx)
This component displays the first child on the left and all other children on the right.
Primarily designed to display form elements like inputs and buttons on the right with a label on the left.

If more than 2 children are supplied, all children after the second will be rendered below the second.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| children | The react nodes to be arranged as a data row | ReactNode | required |
| elementType | The react element to use as container | string/JSXElementConstructor | `'div'` |
| ...props | All other props will be directly applied to the container element | | |

### Example
```jsx
<DataRow>
    <span>Enter your name</span>
    <Input/>    
</DataRow>
```
