## [SuspenseWaitCursor](src/components/wait-cursor/SuspenseWaitCursor.tsx)
An implementation of React.Suspense, the react component for lazy loading, that displays a chayns wait cursor as fallback.

| Prop | Description | Type | Required/Default |
|------|-------------|------|------------------|
| children | The children that contain lazily loaded components | ReactNode | required |
| inline | `true`: display chayns-components SmallWaitCursor <br/>`false`: call chayns.showWaitCursor() | boolean | `false` |

### Examples
```jsx
// lazy load admin view so the code is only downloaded once admin view is activated
const AdminView = React.lazy(() => import('./admin-view/AdminView.jsx'));

const App = () => {
    return (
        <SuspenseWaitCursor>
            {
                chayns.env.user.adminMode
                ? <AdminView/>
                : <UserView/>
            }
        </SuspenseWaitCursor>
    );
}
```
