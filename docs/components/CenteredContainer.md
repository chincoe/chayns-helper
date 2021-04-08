## [CenteredContainer](src/components/containers/CenteredContainer.tsx)
A container that centers its children.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| children | The elements to be centered | ReactNode | required |
| gap | Leave a 15px gap between the children | boolean | `false` |
| vertical | Display children vertically instead of horizontally | boolean | `false` |
| elementType | The react element to use as container | string/JSXElementConstructor | `'div'` |
| ...props | All other props will be directly applied to the container element | | |

### Example

```jsx
<CenteredContainer gap>
    <Button onClick={onClick}>
        Click me!
    </Button>
    <Button onClick={onClick}>
        Click me, too!
    </Button>
</CenteredContainer>
```
