## [getJwtPayload](src/functions/getJwtPayload.ts)
Safely get the payload of a JWT token

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| accessToken | The jwt token | string | required |
| **@returns** | the JSON object, or null if parsing the payload failed | | |

### Examples
```javascript
const userPayload = getJwtPayload(chayns.env.user.tobitAccessToken);
```
