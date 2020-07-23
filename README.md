chayns-helper
===================
This package contains a variety of useful helpers for chayns development.
Read the comments in the source code for a more detailed description and further information to each asset.
## Initialization
Initialize the helper in your index.js to make sure that every feature actually works:
```javascript
initChaynsHelper({
    textStringPrefix: 'txt_chayns_myapp_', // necessary to use all textString helpers
    live: __PROD__, // used by a variety of helpers, though it mostly affects only logs
    requestErrorHandler: myRequestErrorHandler // default is defaultErrorHandler, used only by handleRequest
});
```

##Contents
###Components
| Component                                                                | Description                 |
|--------------------------------------------------------------------------|-----------------------------|
| [CenteredButtonContainer](/src/Components/Containers/CenteredButtonContainer.jsx)| Centered container for Buttons |
| [CenteredContainer](/src/Components/Containers/CenteredContainer.jsx)| Centered container |
| [CenteredWaitCursor](/src/Components/Containers/CenteredWaitCursor.jsx)| Inline-waitCursor, centered and with padding |
| [ChaynsEditor](/src/Components/ChaynsEditor/ChaynsEditor.jsx)| Chayns-Editor Wrapper |
| [DataRow](/src/Components/Containers/DataRow.jsx)| Container for a row with a label and e.g. a button |
| [DateTimeChooseButton](/src/Components/Buttons/DateTimeChooseButton.jsx)| Choose button to choose a date with an advancedDate dialog |
| [ErrorBoundary](/src/Components/ErrorBoundary/ErrorBoundary.jsx)| Customizable ErrorBoundary to catch errors during render |
| [refresh](/src/Components/Other/Refresh.jsx)| HOC to rerender a Component in an interval |
| [RefreshComponent](/src/Components/Other/RefreshComponent.jsx)| Component to rerender its children in an interval |
| [RefreshComponent](/src/Components/Other/RefreshComponent.jsx)| Component to rerender its children in an interval |
| [ResizableWaitCursor](/src/Components/Other/ResizableWaitCursor.jsx)| chayns SmallWaitCursor but resizable |
| [RestrictedAccordion](/src/Components/RestrictedAccordion/RestrictedAccordion.jsx)| Accordion with lock-icon for admins |
| [SuspenseWaitCursor](/src/Components/Other/SuspenseWaitCursor.jsx)| Suspense-Component that provides a fallback for React lazy loading |
| [TextStringComplex](/src/TextString/TextStringMemo.jsx)| Memoized Textstring Component, adds prefix. Allows complex replacements with JSX and CTRL+Click to edit |
| [TextStringMemo](/src/TextString/TextStringMemo.jsx)| Memoized Textstring Component, adds prefix |
| [UACGroupChooseButton](/src/Components/Buttons/UACGroupChooseButton.jsx)| ChooseButton for UAC groups |

###Hooks
| Hook                                                                 | Description                   |
|----------------------------------------------------------------------|-------------------------------|
| [useElementProps](/src/Hooks/useElementProps.js)| Remove custom props to spread the remaining props on an HTML element |
| [useFullscreenTapp](/src/Hooks/useFullscreenTapp.js)| Hook to create a fullscreen tapp without scrolling |
| [useFunctionState](/src/Hooks/useFunctionState.js)| useState that can contain a function directly |
| [useRefresh](/src/Hooks/useRefresh.js)| generates a random ID in an interval to force re-render |
| [useTextStrings](/src/TextString/TextStringMemo.jsx)| get memoized TextStrings from a list of string names |
| [useTimeoutState](/src/Hooks/Uniques/useTimeoutState.js)| useState that calls an onChange method if the value hasn't change for a certain time |
| [useUniqueEventListener](/src/Hooks/Uniques/useUniqueEventListener.js)| removes an old eventListener when a new one is set |
| [useUniqueInterval](/src/Hooks/Uniques/useUniqueInterval.js)| clears a previous interval when a new one is set |
| [useUniqueTimeout](/src/Hooks/Uniques/useUniqueTimeout.js)| clears a previous timeout when a new one is set |
| [useWebsocketService](/src/Hooks/useWebsocketService.js)| configure a tobit-websocket-service-client |

###Redux
| Asset                                                                 | Description                   |
|----------------------------------------------------------------------|-------------------------------|
| [rtkThunkCase](/src/Redux/rtkThunkCase.js)| create the 3 reducer cases for a ReduxToolkit async thunk |
| [useActions](/src/Redux/useActions.js)| bind a list of action creators |
| [useComplexSelector](/src/Redux/useComplexSelector.js)| a useSelector Hook using reselect's createSelector |
| [useShallowSelector](/src/Redux/useShallowSelector.js)| a useSelector Hook with shallowEqual |

###Functions
| Function                                                                 | Description                   |
|----------------------------------------------------------------------|-------------------------------|
| [backgroundColorClass](/src/Functions/chaynsColors.js)| get a chayns background color class name |
| [borderColorClass](/src/Functions/chaynsColors.js)| get a chayns border color class name |
| [colorClass](/src/Functions/chaynsColors.js)| get a chayns color class name |
| [copyOnClick](/src/Functions/copy.js)| copy a value to the user's clipboard |
| [defaultErrorHandler](/src/Functions/defaultErrorHandler.js)| default request error handling with dialogs for error status codes |
| [fnsFormat](/src/Functions/timeHelper.js)| datefns format with option to use today/tomorrow/yesterday |
| [formatDate](/src/Functions/timeHelper.js)| Format date: [Gestern/Heute/Morgen/12.3./12.3.2019], HH:mm Uhr |
| [formatDateText](/src/Functions/timeHelper.js)| Format date: [gestern/heute/mMorgen/am 12.3./am 12.3.2019] um HH:mm Uhr |
| [getChaynsColor](/src/Functions/chaynsColors.js)| get a chayns color in hex from its color name |
| [getChaynsColorRgb](/src/Functions/chaynsColors.js)| get a chayns color in rgb from its color name |
| [handleRequest](/src/Functions/httpRequest.js)| try/catch-wrapper for http requests |
| [hexToRgb](/src/Functions/chaynsColors.js)| convert hex color string to rgb |
| [hideCWFooter](/src/Functions/chaynsCalls.js)| hide the chayns web footer |
| [httpRequest](/src/Functions/httpRequest.js)| fetch helper with loads of options |
| [localStorage](/src/Other/localStorageHelper.js)| helper to cache httpRequest JSON strings in local storage |
| [mixChaynsColorRgb](/src/Functions/chaynsColors.js)| mix 2 chayns colors |
| [removeTimeZoneOffset](/src/Functions/timeHelper.js)| Remove timezone offset of dates that claim to be UTC but are actually local |
| [RequestError](/src/Functions/httpRequest.js)| Error class for error status codes |
| [setViewMode](/src/Functions/chaynsCalls.js)| toggle exclusive mode |
| [showSuccessAnimation](/src/Functions/showSuccessAnimation.js)| show a dialog with a success animation |
| [simpleTimeFormat](/src/Functions/timeHelper.js)| Format date: HH:mm |
| [time](/src/Functions/timeHelper.js)| constant for times based on ms |
| [types](/src/Functions/types.js)| a collection of helpers for types in general but especially objects and arrays. Includes: mapObject, reduceObject, mapObjectToArray, forEachKey, firstOrDefault, replaceAll, type checking |
| [waitCursor](/src/Functions/waitCursor.js)| helper for chayns.showWaitCursor with a timeout before displaying |
| [WebSocketClient](/src/Other/webSocketClient.js)| custom alternative to tobit-websocket-service-client |










