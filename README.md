chayns-helper
===================
This package contains a variety of useful helpers for [chayns](https://github.com/TobitSoftware) development.
Read the comments in the source code for a more detailed description and further information to each asset.
## Initialization
Initialize the helper in your index.js to make sure that every feature actually works:
```javascript
initChaynsHelper({
    textStringPrefix: 'txt_chayns_myapp_', // necessary to use all textString helpers
    requestErrorHandler: myRequestErrorHandler // used only by handleRequest
});
```

> **_NOTE:_** This package may lack markdown documentations and examples but features JsDoc comments instead. If you would like me to add examples and a readme to a feature, let me know and I'll add them.

## Contents
### Components
| Component                                                                | Description                 |
|--------------------------------------------------------------------------|-----------------------------|
| [CenteredContainer](/src/components/containers/CenteredContainer.jsx)| Centered container |
| [CenteredWaitCursor](/src/components/wait-cursor/CenteredWaitCursor.jsx)| Inline-waitCursor, centered and with padding |
| [DataRow](/src/components/containers/DataRow.jsx)| Container for a row with a label and e.g. a button |
| [ErrorBoundary](/src/components/error-boundary/ErrorBoundary.jsx)| Customizable ErrorBoundary to catch errors during render |
| [refresh](/src/components/other/refresh.jsx)| HOC to rerender a Component in an interval |
| [Refresh](/src/components/other/RefreshComponent.jsx)| Component to rerender its children in an interval |
| [rerender](/src/components/other/rerender.jsx)| HOC that passes a rerenderSelf function to a component |
| [ResizableWaitCursor](/src/components/wait-cursor/ResizableWaitCursor.jsx)| chayns SmallWaitCursor but resizable |
| [RestrictedAccordion](/src/components/restricted-accordion/RestrictedAccordion.jsx)| Accordion with lock-icon for admins |
| [SuspenseWaitCursor](/src/components/wait-cursor/SuspenseWaitCursor.jsx)| Suspense-Component that provides a fallback for React lazy loading |
| [TextStringMemo](/src/textstring/TextStringMemo.jsx)| Memoized Textstring Component, adds prefix. Allows complex replacements with JSX and CTRL+Click to edit |
| [UACGroupChooseButton](/src/components/buttons/UACGroupChooseButton.jsx)| ChooseButton for UAC groups |

### Hooks
| Hook                                                                 | Description                   | Readme |
|----------------------------------------------------------------------|-------------------------------| --------|
| [useAsyncState](/src/hooks/useAsyncState.js)| useState hook that can resolve Promises and accepts async setter functions |
| [useAxis](/src/functions/recharts/useAxis.js)| a hook to generate a better recharts axis |
| [useClampLines](/src/hooks/useClampLines.js)| a hook to restrict a text to a maxHeight |
| [useExtendedState](/src/hooks/useExtendedState.js)| useState hook with async getter and prevState |
| [useFullscreenTapp](/src/hooks/useFullscreenTapp.js)| Hook to create a fullscreen tapp without scrolling | [useFullscreenTapp.md](/src/hooks/useFullscreenTapp.md) |
| [useInlineSelector](/src/hooks/useInlineSelector.js)| useSelector that doesn't use a constant selector without performance issues |
| [usePrevious](/src/hooks/usePrevious.js)| access a value from a previous render |
| [usePreviousEffect](/src/hooks/usePreviousEffect.js)| useEffect hook that can access the previous values of its dependencies |
| [usePrevState](/src/hooks/usePrevState.js)| useState hook that can access its value from a previous render |
| [useTextStrings](/src/textstring/TextStringMemo.jsx)| get memoized TextStrings from a list of string names |
| [useTimeoutState](/src/hooks/uniques/useTimeoutState.js)| useState that calls an onChange method if the value hasn't change for a certain time | [useTimeoutState.md](/src/hooks/uniques/useTimeoutState.md) |
| [useUniqueEventListener](/src/hooks/uniques/useUniqueEventListener.js)| removes an old eventListener when a new one is set |
| [useUniqueInterval](/src/hooks/uniques/useUniqueInterval.js)| clears a previous interval when a new one is set |
| [useUniqueTimeout](/src/hooks/uniques/useUniqueTimeout.js)| clears a previous timeout when a new one is set |
| [useUpdateEffect](/src/hooks/useUpdateEffect.js)| useEffect() hook that won't run on the first render |
| [useUser](/src/hooks/useUser.js)| chayns.getUser() hook |
| [useWebsocketService](/src/hooks/useWebsocketService.js)| configure a tobit-websocket-service-client | [useWebsocketService.md](/src/hooks/useWebsocketService.md) |
| [useShallowSelector](/src/hooks/useShallowSelector.js)| a useSelector Hook with shallowEqual |

### Functions
| Function                                                                 | Description                   | Readme |
|----------------------------------------------------------------------|-------------------------------|----- |
| [chaynsCall](/src/functions/chaynsCalls/chaynsCalls.js)| wraps the chaynsCall callbacks behind a simple promise. Just await the chayns call to get the return value | |
| [chaynsDialogs](/src/functions/chaynsDialogs.js)| makes using chayns dialogs much more comfortable | |
| [copyToClipboard](/src/functions/copy.js)| copy a value to the user's clipboard | |
| [fnsFormat](/src/functions/timeHelper/fnsFormat.js)| date-fns format with option to use today/tomorrow/yesterday and add the year if it's not the current year | |
| [generateAxis](/src/functions/recharts/generateAxis.js)| a function to generate a better recharts axis | |
| [generateUUID](/src/functions/generateUid.js)| generate a GUID | |
| [getChaynsErrorCode](/src/functions/httpRequest/getChaynsErrorCode.js)| get the error code of a chayns error response. Can deal with Response, Promise and Object | |
| [getHookState](/src/functions/getHookState.js)| get the current state of a hook via the setState function | |
| [getJsonSettings](/src/functions/getJsonSettings.js)| pass as second param to JSON.stringify to modify the serialization | |
| [Guid](/src/functions/guid.js)| a Guid class | |
| [hexToRgb](/src/functions/colors/hexToRgb.js)| Convert a hex color to an rgb object which returns a rgba() css function when stringified | |
| [hideCWFooter](/src/functions/chaynsCalls/hideCwFooter.js)| hide the chayns web footer | |
| [isChaynsError](/src/functions/httpRequest/isChaynsError.js)| determine whether something is a chayns error. Can deal with Response, Promise and Object | |
| [jsxReplace](/src/textstring/jsxReplace.jsx)| replace strings or regex matches in a string with other strings or jsx | |
| [request](/src/functions/httpRequest/httpRequest.js)| fetch helper with loads of options, constants and a try/catch wrapper | [httpRequest.md](/src/functions/httpRequest/httpRequest.md) |
| [localStorage](/src/other/localStorageHelper.js)| helper to cache httpRequest JSON strings in local storage | |
| [setViewMode](/src/functions/chaynsCalls/chaynsCalls.js)| toggle exclusive mode | |
| [shallowEqual](/src/functions/shallowEqual.js)| check 2 values for equality | |
| [stringToColor](/src/functions/colors/stringToColor.js)| Convert a string to a hex color or rgb color object which returns a rgba() css function when stringified | |
| [toHslColor](/src/functions/colors/toHslColor.js)| Convert a string or int to an hsl color object which returns a hsl() css function when stringified | |
| [types](/src/functions/types.js)| a collection of helpers for types in general but especially objects and arrays. Includes: mapObject, reduceObject, mapObjectToArray, forEachKey, firstOrDefault, replaceAll, type checking | |
| [showWaitCursor](/src/functions/waitCursor.js)| helper for chayns.showWaitCursor with a timeout before displaying ||
| [WebSocketClient](/src/other/WsClient.js)| custom alternative to tobit-websocket-service-client | |

### Constants
| Constant                                                     | Description                   | Readme |
|--------------------------------------------------------------|-------------------------------|----- |
| [statusAnimations](/src/constants/statusAnimations.js) | success and failure animation html string for dialogs | |
| [time](/src/constants/time.js)| constant for times based on ms | |

### Other
| Asset                                                     | Description                   | Readme |
|--------------------------------------------------------------|-------------------------------|----- |
| [chaynsDoc](/src/other/chaynsDoc.js) | A JsDoc documentation of the global chayns Object that enables auto completion in WebStorm | |





