![Last Commit](https://img.shields.io/github/last-commit/chincoe/chayns-helper)
![License](https://img.shields.io/github/license/chincoe/chayns-helper)
![Issues](https://img.shields.io/github/issues/chincoe/chayns-helper)
![Contributors](https://img.shields.io/github/contributors/chincoe/chayns-helper)
![React Version](https://img.shields.io/npm/dependency-version/chayns-helper/peer/react)
![Chayns-Components Version](https://img.shields.io/npm/dependency-version/chayns-helper/peer/chayns-components)


<div align="center">
<h1>chayns-helper</h1>
<p>A variety of useful helpers for <a href="https://github.com/TobitSoftware">chayns</a> development.</p>
<div style="border-bottom: 2px solid gray; padding-bottom: 8px; margin-bottom: 10px">
    <img src="https://img.shields.io/npm/v/chayns-helper?style=for-the-badge" alt="" />
    <img src="https://img.shields.io/npm/dm/chayns-helper.svg?style=for-the-badge" alt="" />
    <img src="https://img.shields.io/npm/types/chayns-helper?style=for-the-badge" alt="" />
    <img src="https://img.shields.io/badge/Tree%20Shaking-Available-green?style=for-the-badge" alt="" />
</div>
</div>

## Installation

```shell script
npm install chayns-helper
```

#### Peer Dependencies

* `react`
* `chayns-components`
* `chayns-logger` (optional)

This package supports tree-shaking, so each module will only be included in your bundle if it is imported by you or
another module.

## Contents

* [Essentials](#essentials)
* [Chayns Services and Utilities](#chayns-services-and-utilities)
* [UI and Forms](#ui-and-forms)
* [React Utilities](#react-utilities)
* [Utilities For Other Packages](#utilities-for-other-packages)
* [Miscellaneous Utilities](#miscellaneous-utilities)

### Essentials

| Name | Description | Type |
|--------|-------------|------|
| [ErrorBoundary](https://github.com/chincoe/chayns-helper/blob/master/docs/components/ErrorBoundary.md)| Customizable ErrorBoundary to catch errors during render | Component |
| [request](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/httpRequest.md)| HttpRequest Helper, highly customizable | Function, Constants |

### Chayns Services and Utilities

| Name | Description | Type |
|--------|-------------|------|
| [addChaynsLoginListener](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/setReloadOnLogin.md#addchaynsloginlistenercallback-once)| Similar to addAccessTokenChangeListener, but prevent reload on login/logout in a pagemaker iframe as well | Function |
| [chaynsDialogs](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsDialogs.md)| makes using chayns dialogs much more comfortable | Functions |
| [enableBodyScroll](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/enableBodyScroll.md)| enable or disable scrolling | Function |
| [getChaynsErrorCode](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/httpRequest.md#getchaynserrorcodevalue)| get the error code of a chayns error response. Can deal with Response, Promise and Object | Function |
| [getTextStrings](https://github.com/chincoe/chayns-helper/blob/master/docs/textstring/TextString.md#gettextstrings)| get one or more text strings with fallbacks and prefix | Function |
| [hideCWFooter](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/hideCwFooter.md)| hide the chayns web footer | Function |
| [isChaynsError](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/httpRequest.md#ischaynserrorvalue)| determine whether something is a chayns error. Can deal with Response, Promise and Object | Function |
| [isCustomTappIFrame](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/isPagemakerIFrame.md)| check if application is in custom tapp iframe | Function |
| [isPagemakerIFrame](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/isPagemakerIFrame.md)| check if application is in pagemaker iframe | Function |
| [removeChaynsLoginListener](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/setReloadOnLogin.md#removechaynsloginlistenercallback)| remove the chaynsLoginListener | Function |
| [setReloadOnLogin](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/setReloadOnLogin.md#setreloadonloginreload)| enable/disable reload on login/logout for pagemaker iframes | Function |
| [setViewMode](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/setViewMode.md)| toggle exclusive mode | Function |
| [showWaitCursor](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/waitCursor.md)| helper for chayns.showWaitCursor with a timeout before displaying | Function |
| [TextStringComplex](https://github.com/chincoe/chayns-helper/blob/master/docs/textstring/TextString.md)| Memoized Textstring Component with prefix config and auto creation | Component |
| [useFullscreenTapp](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useFullscreenTapp.md)| Hook to create a fullscreen tapp without scrolling | Hook |
| [useTextStrings](https://github.com/chincoe/chayns-helper/blob/master/docs/textstring/TextString.md#usetextstrings)| get memoized TextStrings from a list of string names | Hook |
| [useUser](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useUser.md)| chayns.getUser() hook | Hook |
| [useWebsocketService](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useWebsocketService.md)| configure a tobit-websocket-service-client | Hook |
| [WebSocketClient](https://github.com/chincoe/chayns-helper/blob/master/docs/other/WebSocketClient.md)| custom alternative to tobit-websocket-service-client | Class |

### UI and Forms

| Name | Description | Type |
|--------|-------------|------|
| [CenteredContainer](https://github.com/chincoe/chayns-helper/blob/master/docs/components/CenteredContainer.md)| Container to center its children with or without a gap between them | Component |
| [CenteredWaitCursor](https://github.com/chincoe/chayns-helper/blob/master/docs/components/CenteredWaitCursor.md)| Inline-waitCursor, centered and with padding | Component |
| [DataRow](https://github.com/chincoe/chayns-helper/blob/master/docs/components/DataRow.md)| Container for a row with a label and e.g. a button | Component |
| [ResizableWaitCursor](https://github.com/chincoe/chayns-helper/blob/master/docs/components/ResizableWaitCursor.md)| chayns SmallWaitCursor but resizable | Component |
| [RestrictedAccordion](https://github.com/chincoe/chayns-helper/blob/master/docs/components/RestrictedAccordion.md)| Accordion with lock-icon for admins | Component |
| [UACGroupChooseButton](https://github.com/chincoe/chayns-helper/blob/master/docs/components/UACGroupChooseButton.md)| ChooseButton for UAC groups | Component |
| [useClampLines](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useClampLines.md)| a hook to restrict a text to a maxHeight or max lines | Hook |
| [useTimeoutState](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useTimeoutState.md)| useState that calls an onChange method if the value hasn't change for a certain time | Hook |

### React Utilities

| Name | Description | Type |
|--------|-------------|------|
| [getHookState](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/getHookState.md)| get the current state of a hook via the setState function | Function |
| [jsxReplace](https://github.com/chincoe/chayns-helper/blob/master/docs/textstring/TextString.md#jsxreplace)| replace strings or regex matches in a string with other strings or jsx | Function |
| [refresh](https://github.com/chincoe/chayns-helper/blob/master/docs/components/refresh.md)| HOC to rerender a Component in an interval | HOC |
| [RefreshComponent](https://github.com/chincoe/chayns-helper/blob/master/docs/components/RefreshComponent.md)| Component to rerender its children in an interval | Component |
| [rerender](https://github.com/chincoe/chayns-helper/blob/master/docs/components/rerender.md)| HOC that passes a rerenderSelf function to a component | HOC |
| [SuspenseWaitCursor](https://github.com/chincoe/chayns-helper/blob/master/docs/components/SuspenseWaitCursor.md)| Suspense-Component that provides a fallback for React lazy loading | Component |
| [useExtendedState](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useExtendedState.md)| useState hook with async getter and prevState | Hook |
| [usePrevious](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/usePrevious.md)| access a value from a previous render | Hook |
| [usePreviousEffect](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/usePreviousEffect.md)| useEffect hook that can access the previous values of its dependencies | Hook |
| [useUniqueInterval](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useTimeoutState.md#useuniqueinterval)| clears a previous interval when a new one is set | Hook |
| [useUniqueTimeout](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useTimeoutState.md#useuniquetimeout)| clears a previous timeout when a new one is set | Hook |
| [useUpdateEffect](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useUpdateEffect.md)| useEffect() hook that won't run on the first render | Hook |

### Utilities For Other Packages

| Name | Package | Description | Type |
|------|---------|-------------|------|                                                                                                     
| [fnsFormat](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/fnsFormat.md) | date-fns | date-fns format with option to use today/tomorrow/yesterday and add the year if it's not the current year | Function |
| [generateRechartsAxis](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/generateRechartsAxis.md) | recharts | a function to generate a better recharts axis | Function |
| [RechartsAxis](https://github.com/chincoe/chayns-helper/blob/master/docs/components/RechartsAxis.md) | recharts | Wrapper for recharts' XAxis or YAxis to create better label intervals | Component |
| [useRechartsAxis](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/generateRechartsAxis.md#userechartsaxis)| recharts | a hook to generate a better recharts axis | Hook |
| [useComparingSelector](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useComparingSelector.md) | redux | a useSelector Hook with shallowEqual/deepEqual | Hook |

### Miscellaneous Utilities

| Name | Description | Type |
|--------|-------------|------|
| [copyToClipboard](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/copyToClipboard.md)| copy a value to the user's clipboard | Function |
| [deepEqual](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/shallowEqual.md#deepequal)| recursive implementation of shallowEqual | Function |
| [generateGuid](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/generateGuid.md)| generate a GUID | Function |
| [getJsonSettings](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/getJsonSettings.md)| pass as second param to JSON.stringify to modify the serialization | Function |
| [getJwtPayload](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/getJwtPayload.md)| safely get JWT token payload | Function |
| [hexToRgb](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/hexToRgb.md)| Convert a hex color to an rgb object which returns a rgba() css function when stringified | Function |
| [shallowEqual](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/shallowEqual.md)| check 2 values for equality | Function |
| [statusAnimations](https://github.com/chincoe/chayns-helper/blob/master/docs/constants/statusAnimations.md) | success and failure animation html string for dialogs | Constant |
| [stringToColor](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/stringToColor.md)| Convert a string to a hex color or rgb color object which returns a rgba() css function when stringified | Function |
| [time](https://github.com/chincoe/chayns-helper/blob/master/docs/constants/time.md)| constant for times based on ms | Constant |
| [toHslColor](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/toHslColor.md)| Convert a string or int to an hsl color object which returns a hsl() css function when stringified | Function |
| [types](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/types.md)| a collection of helpers for types in general but especially objects and arrays. Includes: mapObject, reduceObject, mapObjectToArray, forEachKey, firstOrDefault, replaceAll, type checking | Functions |

## Other

### Custom Logger

By default, this package will use the private `chayns-logger` package for logging. If you want to use a custom logger,
you can specify a custom logger:

```javascript
// init
setCustomLogger({
    debug(data) { },
    info(data) { },
    warning(data, error) { },
    error(data, error) { },
    critical(data, error) { }
})
```
Regular log data will look like this:
```typescript
const logData = {
    message: 'Log message',
    data: { /* object with custom log data */ },
    section: 'file.js' 
}
```

If any of these functions is not defined it will use the default value of `console.debug|log|warn|error`, depending on
log level.
