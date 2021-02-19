## [useUser](src/hooks/useUser.ts)
A wrapper for the `chayns.getUser` function to provide asynchronously fetched user information in a react component.
This helper also keeps the results of previous calls in memory to prevent duplicate fetches.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| userInfo | an object containing either a userId or personId | { userId?: number, personId?: string } | required |
| **@returns** | { PersonID, FirstName, LastName, UserID, UserFullName } | | `{}` |

### Examples
```javascript
const {
    Type,
    PersonID,
    FacebookID,
    FirstName,
    UserID,
    LastName,
    ChaynsLogin,
    UserFullName
} = useUser({ userId });
```
