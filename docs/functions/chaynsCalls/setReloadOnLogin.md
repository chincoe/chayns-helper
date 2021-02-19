## [setReloadOnLogin](src/functions/chaynsCalls/setReloadOnLogin.ts)
By default, a chayns site is reloaded when a user is logs in or out.
Usually, this can be circumvented by declaring an `accessTokenChangeListener`.
However, this does not work as expected in PagemakerV2 iFrames.
This helper implements a workaround and unifies the behavior of both pagemaker and non-pagemaker iFrames.

### addChaynsLoginListener(callback, once)
Add a login listener. As long as a listener is active, reload on login/logout will be disabled. If a login/logout occurs, the listener will be called.

| Parameter | Description | Type | Required/Default |
|-----------|----------------|----------|--------|
| callback | a function to be called when a login/logout occurs | function | required |
| once | if set to true the listener will be removed after being called once | boolean | `false` |
| **@returns** | the listener that was set. This value is necessary to remove the listener | function | |

### addChaynsLoginListener(callback, once)
Remove a login listener. As long as a listener is active, reload on login/logout will be disabled. If a login/logout occurs, the listener will be called.

| Parameter | Description | Type | Required/Default |
|-----------|----------------|----------|--------|
| callback | the exact listener returned from addChaynsLoginListener that should be removed | function | required |
| **@returns** | listener removed successfully | boolean | |

### setReloadOnLogin(reload)
Set whether you a login/logout should trigger a reload in a pagemaker iFrame

| Parameter | Description | Type | Required/Default |
|-----------|----------------|----------|--------|
| reload | Reload on login on/off | boolean | `false` |
