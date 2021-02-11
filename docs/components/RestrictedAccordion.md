## [RestrictedAccordion](src/components/restricted-accordion/RestrictedAccordion.tsx)
A wrapper for the chayns-components [Accordion](https://github.com/TobitSoftware/chayns-components/blob/master/docs/components/accordion.md)
that applies the styles for an accordion that is only visible by managers.
Still supports `onSearch` despite the lock icon on the right.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| useAdminStyle | toggle the restricted style on and off. Behaves exactly like a default accordion if false | boolean | `true` |
| ...props | All other props will be directly applied to the accordion | | |

### Example
```jsx
<RestrictedAccordion
    head="My Accordion"
>
    <div className="accordion__content">Hello world</div>
</RestrictedAccordion>
```
