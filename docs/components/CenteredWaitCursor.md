## [CenteredWaitCursor](src/components/wait-cursor/CenteredWaitCursor.tsx)

A wrapper for the
chayns-components [SmallWaitCursor](https://github.com/TobitSoftware/chayns-components/blob/master/docs/components/small-wait-cursor.md)
that is extended by a small padding and is always centered. It also only displays after a short customizable timeout to
reduce the likelihood of very short display.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| delay | the delay in ms after which the wait cursor should be displayed | number | `300` |
| elementType | The react element to use as container | string/JSXElementConstructor | `'div'` |
| ...props | All other props will be directly applied to the container element | | |

### Example
```jsx
<CenteredWaitCursor delay={500}/>
```
