## [ResizableWaitCursor](src/components/wait-cursor/ResizableWaitCursor.tsx)
A wrapper for the
chayns-components [SmallWaitCursor](https://github.com/TobitSoftware/chayns-components/blob/master/docs/components/small-wait-cursor.md)
that is extended by the ability to resize the wait cursor.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| size | size of the wait cursor in px. Must be divisible by 3 and 2 to not look ugly | number | `32` |
| ...props | All other props will be directly applied to the wait cursor node | | |

### Examples
```jsx
<ResizableWaitCursor size={24}/>
```
