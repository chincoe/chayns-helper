![Types](https://img.shields.io/npm/types/chayns-helper)
![Last Commit](https://img.shields.io/github/last-commit/chincoe/chayns-helper)
![Issues](https://img.shields.io/github/issues/chincoe/chayns-helper)
![Known Vulnerabilities](https://snyk.io/test/github/dwyl/hapi-auth-jwt2/badge.svg?targetFile=package.json)
![React Version](https://img.shields.io/npm/dependency-version/chayns-helper/peer/react)
![Chayns-Components Version](https://img.shields.io/npm/dependency-version/chayns-helper/peer/chayns-components)


<div align="center">
<h1>chayns-helper</h1>
<div style="border-bottom: 2px solid gray; padding-bottom: 8px; margin-bottom: 10px">
    <img src="https://img.shields.io/npm/v/chayns-helper?style=for-the-badge" alt="" />
    <img src="https://img.shields.io/npm/dm/chayns-helper.svg?style=for-the-badge" alt="" />
    <img src="https://img.shields.io/github/license/chincoe/chayns-helper?style=for-the-badge" alt="" />
    <img src="https://img.shields.io/github/contributors/chincoe/chayns-helper?style=for-the-badge" alt="" />
</div>
</div>
This package contains a variety of useful helpers for <a href="https://github.com/TobitSoftware">chayns</a> development.

## Installation

```shell script
npm install chayns-helper
```

This package requires `react`, `chayns-components` and `chayns-logger` to work correctly.
Please make sure you have those installed.

This package supports tree-shaking, so each module will only be included in your bundle if it is imported by you or another module.

> **_NOTE:_** This package may lack documentations and examples. If you would like me to add examples and a readme to a feature, let me know, and I'll add them.

## Contents

### Components

| Component                                                                | Description                 |
|--------------------------------------------------------------------------|-----------------------------|
| [CenteredContainer](https://github.com/chincoe/chayns-helper/blob/master/docs/components/CenteredContainer.md)| Container to center its children with or without a gap between them |
| [CenteredWaitCursor](https://github.com/chincoe/chayns-helper/blob/master/docs/components/CenteredWaitCursor.md)| Inline-waitCursor, centered and with padding |
| [DataRow](https://github.com/chincoe/chayns-helper/blob/master/docs/components/DataRow.md)| Container for a row with a label and e.g. a button |
| [ErrorBoundary](https://github.com/chincoe/chayns-helper/blob/master/docs/components/ErrorBoundary.md)| Customizable ErrorBoundary to catch errors during render |
| [RechartsAxis](https://github.com/chincoe/chayns-helper/blob/master/docs/components/RechartsAxis.md)| Wrapper for recharts' XAxis or YAxis to create better label intervals |
| [refresh](https://github.com/chincoe/chayns-helper/blob/master/docs/components/refresh.md)| HOC to rerender a Component in an interval |
| [RefreshComponent](https://github.com/chincoe/chayns-helper/blob/master/docs/components/RefreshComponent.md)| Component to rerender its children in an interval |
| [rerender](https://github.com/chincoe/chayns-helper/blob/master/docs/components/rerender.md)| HOC that passes a rerenderSelf function to a component |
| [ResizableWaitCursor](https://github.com/chincoe/chayns-helper/blob/master/docs/components/ResizableWaitCursor.md)| chayns SmallWaitCursor but resizable |
| [RestrictedAccordion](https://github.com/chincoe/chayns-helper/blob/master/docs/components/RestrictedAccordion.md)| Accordion with lock-icon for admins |
| [SuspenseWaitCursor](https://github.com/chincoe/chayns-helper/blob/master/docs/components/SuspenseWaitCursor.md)| Suspense-Component that provides a fallback for React lazy loading |
| [TextStringComplex](https://github.com/chincoe/chayns-helper/blob/master/docs/textstring/TextString.md)| Memoized Textstring Component, adds prefix. Allows complex replacements with JSX, autoCreation and CTRL+Click to edit |
| [UACGroupChooseButton](https://github.com/chincoe/chayns-helper/blob/master/docs/components/UACGroupChooseButton.md)| ChooseButton for UAC groups |

### Hooks

| Hook                                                                 | Description                   |
|----------------------------------------------------------------------|-------------------------------|
| [useRechartsAxis](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/generateRechartsAxis.md#userechartsaxis)| a hook to generate a better recharts axis |
| [useClampLines](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useClampLines.md)| a hook to restrict a text to a maxHeight or max lines |
| [useComparingSelector](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useComparingSelector.md)| a useSelector Hook with shallowEqual/deepEqual |
| [useExtendedState](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useExtendedState.md)| useState hook with async getter and prevState |
| [useFullscreenTapp](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useFullscreenTapp.md)| Hook to create a fullscreen tapp without scrolling |
| [usePrevious](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/usePrevious.md)| access a value from a previous render |
| [usePreviousEffect](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/usePreviousEffect.md)| useEffect hook that can access the previous values of its dependencies |
| [useTextStrings](https://github.com/chincoe/chayns-helper/blob/master/docs/textstring/TextString.md#usetextstrings)| get memoized TextStrings from a list of string names |
| [useTimeoutState](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useTimeoutState.md)| useState that calls an onChange method if the value hasn't change for a certain time |
| [useUniqueInterval](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useTimeoutState.md#useuniqueinterval)| clears a previous interval when a new one is set |
| [useUniqueTimeout](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useTimeoutState.md#useuniquetimeout)| clears a previous timeout when a new one is set |
| [useUpdateEffect](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useUpdateEffect.md)| useEffect() hook that won't run on the first render |
| [useUser](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useUser.md)| chayns.getUser() hook |
| [useWebsocketService](https://github.com/chincoe/chayns-helper/blob/master/docs/hooks/useWebsocketService.md)| configure a tobit-websocket-service-client |

### Functions

| Function                                                                 | Description                   |
|----------------------------------------------------------------------|-------------------------------|
| [addChaynsLoginListener](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/setReloadOnLogin.md)| Similar to addAccessTokenChangeListener, but prevent reload on login/logout in a pagemaker iframe as well | 
| [chaynsDialogs](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsDialogs.md)| makes using chayns dialogs much more comfortable | 
| [copyToClipboard](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/copyToClipboard.md)| copy a value to the user's clipboard | 
| [deepEqual](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/shallowEqual.md#deepequal)| recursive implementation of shallowEqual | 
| [fnsFormat](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/fnsFormat.md)| date-fns format with option to use today/tomorrow/yesterday and add the year if it's not the current year | 
| [generateRechartsAxis](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/generateRechartsAxis.md)| a function to generate a better recharts axis | 
| [generateGuid](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/generateGuid.md)| generate a GUID | 
| [getChaynsErrorCode](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/httpRequest.md#getchaynserrorcodevalue)| get the error code of a chayns error response. Can deal with Response, Promise and Object | 
| [getHookState](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/getHookState.md)| get the current state of a hook via the setState function | 
| [getJsonSettings](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/getJsonSettings.md)| pass as second param to JSON.stringify to modify the serialization |
| [getJwtPayload](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/getJwtPayload.md)| safely get JWT token payload | 
| [getTextStrings](https://github.com/chincoe/chayns-helper/blob/master/docs/textstring/TextString.md#gettextstrings)| get one or more text strings with fallbacks and prefix | 
| [hexToRgb](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/hexToRgb.md)| Convert a hex color to an rgb object which returns a rgba() css function when stringified | 
| [hideCWFooter](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/hideCwFooter.md)| hide the chayns web footer | 
| [isChaynsError](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/httpRequest.md#ischaynserrorvalue)| determine whether something is a chayns error. Can deal with Response, Promise and Object | 
| [isCustomTappIFrame](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/isPagemakerIFrame.md)| check if application is in custom tapp iframe | 
| [isPagemakerIFrame](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/isPagemakerIFrame.md)| check if application is in pagemaker iframe | 
| [jsxReplace](https://github.com/chincoe/chayns-helper/blob/master/docs/textstring/TextString.md#jsxreplace)| replace strings or regex matches in a string with other strings or jsx |
| [request](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/httpRequest.md)| fetch helper with loads of options, constants and a try/catch wrapper |
| [removeChaynsLoginListener](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/setReloadOnLogin.md)| remove the chaynsLoginListener | 
| [setReloadOnLogin](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/setReloadOnLogin.md)| enable/disable reload on login/logout for pagemaker iframes | 
| [setViewMode](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/chaynsCalls/setViewMode.md)| toggle exclusive mode | 
| [shallowEqual](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/shallowEqual.md)| check 2 values for equality | 
| [stringToColor](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/stringToColor.md)| Convert a string to a hex color or rgb color object which returns a rgba() css function when stringified | 
| [toHslColor](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/toHslColor.md)| Convert a string or int to an hsl color object which returns a hsl() css function when stringified | 
| [types](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/types.md)| a collection of helpers for types in general but especially objects and arrays. Includes: mapObject, reduceObject, mapObjectToArray, forEachKey, firstOrDefault, replaceAll, type checking | 
| [showWaitCursor](https://github.com/chincoe/chayns-helper/blob/master/docs/functions/waitCursor.md)| helper for chayns.showWaitCursor with a timeout before displaying |
| [WebSocketClient](https://github.com/chincoe/chayns-helper/blob/master/docs/other/WsClient.md)| custom alternative to tobit-websocket-service-client | 

### Constants

| Constant                                                     | Description                   |
|--------------------------------------------------------------|-------------------------------|
| [statusAnimations](https://github.com/chincoe/chayns-helper/blob/master/docs/constants/statusAnimations.md) | success and failure animation html string for dialogs | 
| [time](https://github.com/chincoe/chayns-helper/blob/master/docs/constants/time.md)| constant for times based on ms | 
