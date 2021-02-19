## [UACGroupChooseButton](src/components/buttons/UACGroupChooseButton.tsx)
A button that fetches the current site's UAC groups and shows a select dialog on click. Automatically displays the correct label on the button.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| value | uac group(s) that are currently chosen | number/Array<number> | `null` |
| onChange | function that receives the selection of the select dialog on UAC group selection | (selection: Array<{name, value}>) => any | required | 
| multiSelect | allow selection of more than 1 uac group | boolean | `false` |
| disabled | disable the button | boolean | `false` |
| ...props | All other props will be directly applied to the ChooseButton | | |

### Examples
```jsx
const [uacGroup, setUacGroup] = useState(null);

return <UACGroupChooseButton value={uacGroup} onChange={setUacGroup}/>
```
