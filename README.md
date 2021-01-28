<div align="center">
<h1>chayns-helper</h1>
<div style="border-bottom: 2px solid gray; padding-bottom: 8px; margin-bottom: 10px">
    <img src="https://img.shields.io/npm/dm/chayns-helper.svg?style=for-the-badge" alt="" />
    <img src="https://img.shields.io/npm/v/chayns-helper?style=for-the-badge" alt="" />
    <img src="https://img.shields.io/github/license/chincoe/chayns-helper?style=for-the-badge" alt="" />
    <!--<img src="https://img.shields.io/github/contributors/chincoe/chayns-helper?style=for-the-badge" alt="" /> -->
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

| Component                                                                | Description                 | Readme |
|--------------------------------------------------------------------------|-----------------------------| -------|
| [CenteredContainer](/src/components/containers/CenteredContainer.tsx)| Container to center its children with or without a gap between them |
| [CenteredWaitCursor](/src/components/wait-cursor/CenteredWaitCursor.tsx)| Inline-waitCursor, centered and with padding |
| [DataRow](/src/components/containers/DataRow.tsx)| Container for a row with a label and e.g. a button |
| [ErrorBoundary](/src/components/error-boundary/ErrorBoundary.tsx)| Customizable ErrorBoundary to catch errors during render |
| [RechartsAxis](/src/components/recharts-axis/RechartsAxis.tsx)| HOC to rerender a Component in an interval |
| [refresh](/src/components/other/refresh.tsx)| HOC to rerender a Component in an interval |
| [Refresh](/src/components/other/RefreshComponent.tsx)| Component to rerender its children in an interval |
| [rerender](/src/components/other/rerender.tsx)| HOC that passes a rerenderSelf function to a component |
| [ResizableWaitCursor](/src/components/wait-cursor/ResizableWaitCursor.tsx)| chayns SmallWaitCursor but resizable |
| [RestrictedAccordion](/src/components/restricted-accordion/RestrictedAccordion.tsx)| Accordion with lock-icon for admins |
| [SuspenseWaitCursor](/src/components/wait-cursor/SuspenseWaitCursor.tsx)| Suspense-Component that provides a fallback for React lazy loading |
| [TextStringComplex](/src/textstring/TextStringComplex.tsx)| Memoized Textstring Component, adds prefix. Allows complex replacements with JSX, autoCreation and CTRL+Click to edit | [TextString.md](https://github.com/chincoe/chayns-helper/blob/master/src/textstring/TextString.md) |
| [UACGroupChooseButton](/src/components/buttons/UACGroupChooseButton.tsx)| ChooseButton for UAC groups |

### Hooks

| Hook                                                                 | Description                   | Readme |
|----------------------------------------------------------------------|-------------------------------| --------|
| [useAsyncState](/src/hooks/useAsyncState.ts)| useState hook that can resolve Promises and accepts async setter functions |
| [useRechartsAxis](/src/functions/recharts/useRechartsAxis.ts)| a hook to generate a better recharts axis |
| [useClampLines](/src/hooks/useClampLines.ts)| a hook to restrict a text to a maxHeight or max lines | [useClampLines.md](https://github.com/chincoe/chayns-helper/blob/master/src/hooks/useClampLines.md) |
| [useExtendedState](/src/hooks/useExtendedState.ts)| useState hook with async getter and prevState |
| [useFullscreenTapp](/src/hooks/useFullscreenTapp.ts)| Hook to create a fullscreen tapp without scrolling | [useFullscreenTapp.md](https://github.com/chincoe/chayns-helper/blob/master/src/hooks/useFullscreenTapp.md) |
| [useInlineSelector](/src/hooks/useInlineSelector.ts)| useSelector that doesn't use a constant selector without performance issues |
| [usePrevious](/src/hooks/usePrevious.ts)| access a value from a previous render |
| [usePreviousEffect](/src/hooks/usePreviousEffect.ts)| useEffect hook that can access the previous values of its dependencies |
| [usePrevState](/src/hooks/usePrevState.ts)| useState hook that can access its value from a previous render |
| [useTextStrings](/src/textstring/TextStringComplex.tsx)| get memoized TextStrings from a list of string names |
| [useTimeoutState](/src/hooks/uniques/useTimeoutState.ts)| useState that calls an onChange method if the value hasn't change for a certain time | [useTimeoutState.md](https://github.com/chincoe/chayns-helper/blob/master/src/hooks/uniques/useTimeoutState.md) |
| [useUniqueInterval](/src/hooks/uniques/useUniqueInterval.ts)| clears a previous interval when a new one is set |
| [useUniqueTimeout](/src/hooks/uniques/useUniqueTimeout.ts)| clears a previous timeout when a new one is set |
| [useUpdateEffect](/src/hooks/useUpdateEffect.ts)| useEffect() hook that won't run on the first render |
| [useUser](/src/hooks/useUser.ts)| chayns.getUser() hook |
| [useWebsocketService](/src/hooks/useWebsocketService.ts)| configure a tobit-websocket-service-client | [useWebsocketService.md](https://github.com/chincoe/chayns-helper/blob/master/src/hooks/useWebsocketService.md) |
| [useShallowSelector](/src/hooks/useShallowSelector.ts)| a useSelector Hook with shallowEqual |

### Functions

| Function                                                                 | Description                   | Readme |
|----------------------------------------------------------------------|-------------------------------|----- |
| [addChaynsLoginListener](/src/functions/chaynsCalls/setReloadOnLogin.ts)| Similar to addAccessTokenChangeListener, but prevent reload on login/logout in a pagemaker iframe as well | |
| [chaynsCall](/src/functions/chaynsCalls/chaynsCalls.ts)| wraps the chaynsCall callbacks behind a simple promise. Just await the chayns call to get the return value | |
| [chaynsDialogs](/src/functions/chaynsDialogs/chaynsDialogs.ts)| makes using chayns dialogs much more comfortable | |
| [copyToClipboard](/src/functions/copy.ts)| copy a value to the user's clipboard | |
| [fnsFormat](/src/functions/timeHelper/fnsFormat.ts)| date-fns format with option to use today/tomorrow/yesterday and add the year if it's not the current year | |
| [generateRechartsAxis](/src/functions/recharts/useRechartsAxis.ts)| a function to generate a better recharts axis | |
| [generateUUID](/src/functions/generateUid.ts)| generate a GUID | |
| [getChaynsErrorCode](/src/functions/httpRequest/getChaynsErrorCode.ts)| get the error code of a chayns error response. Can deal with Response, Promise and Object | |
| [getHookState](/src/functions/getHookState.ts)| get the current state of a hook via the setState function | |
| [getJsonSettings](/src/functions/getJsonSettings.ts)| pass as second param to JSON.stringify to modify the serialization | [getJsonSettings.md](https://github.com/chincoe/chayns-helper/blob/master/src/functions/getJsonSettings.md) |
| [Guid](/src/functions/guid.ts)| a Guid class | |
| [hexToRgb](/src/functions/colors/hexToRgb.ts)| Convert a hex color to an rgb object which returns a rgba() css function when stringified | |
| [hideCWFooter](/src/functions/chaynsCalls/hideCwFooter.ts)| hide the chayns web footer | |
| [isChaynsError](/src/functions/httpRequest/isChaynsError.ts)| determine whether something is a chayns error. Can deal with Response, Promise and Object | |
| [isCustomTappIFrame](/src/functions/isPagemakerIFrame.ts)| check if application is in custom tapp iframe | |
| [isPagemakerIFrame](/src/functions/isPagemakerIFrame.ts)| check if application is in pagemaker iframe | |
| [jsxReplace](/src/textstring/jsxReplace.tsx)| replace strings or regex matches in a string with other strings or jsx | [TextString.md](https://github.com/chincoe/chayns-helper/blob/master/src/textstring/TextString.md) |
| [request](/src/functions/httpRequest/httpRequest.ts)| fetch helper with loads of options, constants and a try/catch wrapper | [httpRequest.md](https://github.com/chincoe/chayns-helper/blob/master/src/functions/httpRequest/httpRequest.md) |
| [localStorage](/src/other/localStorageHelper.ts)| helper to cache httpRequest JSON strings in local storage | |
| [removeChaynsLoginListener](/src/functions/chaynsCalls/setReloadOnLogin.ts)| remove the chaynsLoginListener | |
| [setReloadOnLogin](/src/functions/chaynsCalls/setReloadOnLogin.ts)| enable/disable reload on login/logout for pagemaker iframes | |
| [setViewMode](/src/functions/chaynsCalls/chaynsCalls.ts)| toggle exclusive mode | |
| [shallowEqual](/src/functions/shallowEqual.ts)| check 2 values for equality | |
| [stringToColor](/src/functions/colors/stringToColor.ts)| Convert a string to a hex color or rgb color object which returns a rgba() css function when stringified | |
| [toHslColor](/src/functions/colors/toHslColor.ts)| Convert a string or int to an hsl color object which returns a hsl() css function when stringified | |
| [types](/src/functions/types.ts)| a collection of helpers for types in general but especially objects and arrays. Includes: mapObject, reduceObject, mapObjectToArray, forEachKey, firstOrDefault, replaceAll, type checking | |
| [showWaitCursor](/src/functions/waitCursor/waitCursor.ts)| helper for chayns.showWaitCursor with a timeout before displaying | [waitCursor.md](https://github.com/chincoe/chayns-helper/blob/master/src/functions/waitCursor/waitCursor.md) |
| [WebSocketClient](/src/other/WsClient.ts)| custom alternative to tobit-websocket-service-client | |

### Constants

| Constant                                                     | Description                   | Readme |
|--------------------------------------------------------------|-------------------------------|----- |
| [statusAnimations](/src/constants/statusAnimations.ts) | success and failure animation html string for dialogs | |
| [time](/src/constants/time.ts)| constant for times based on ms | |
