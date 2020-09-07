chayns-helper
===================
This package contains a variety of useful helpers for chayns development.
Read the comments in the source code for a more detailed description and further information to each asset.
## Initialization
Initialize the helper in your index.js to make sure that every feature actually works:
```javascript
initChaynsHelper({
    textStringPrefix: 'txt_chayns_myapp_', // necessary to use all textString helpers
    requestErrorHandler: myRequestErrorHandler, // default is defaultErrorHandler, used only by handleRequest
    logger: chaynsLogger, // access the chayns logger as it cannot be a dependency for this public package
    useSelector // react-redux useSelector hook, required to use useShallowSelector
});
```

> **_NOTE:_** This package lacks markdown documentations and examples but features JsDoc comments instead. If you would like me to add examples and a readme to a function, let me know and I'll add them.



##Contents
###Components
| Component                                                                | Description                 |
|--------------------------------------------------------------------------|-----------------------------|
| [CenteredButtonContainer](/src/components/containers/CenteredButtonContainer.jsx)| Centered container for Buttons |
| [CenteredContainer](/src/components/containers/CenteredContainer.jsx)| Centered container |
| [CenteredWaitCursor](/src/components/containers/CenteredWaitCursor.jsx)| Inline-waitCursor, centered and with padding |
| [ChaynsEditor](/src/components/chayns-editor/ChaynsEditor.jsx)| Chayns-Editor Wrapper |
| [DataRow](/src/components/containers/DataRow.jsx)| Container for a row with a label and e.g. a button |
| [DateTimeChooseButton](/src/components/buttons/DateTimeChooseButton.jsx)| Choose button to choose a date with an advancedDate dialog |
| [ErrorBoundary](/src/components/error-boundary/ErrorBoundary.jsx)| Customizable ErrorBoundary to catch errors during render |
| [refresh](/src/components/other/Refresh.jsx)| HOC to rerender a Component in an interval |
| [RefreshComponent](/src/components/other/RefreshComponent.jsx)| Component to rerender its children in an interval |
| [RefreshComponent](/src/components/other/RefreshComponent.jsx)| Component to rerender its children in an interval |
| [ResizableWaitCursor](/src/components/other/ResizableWaitCursor.jsx)| chayns SmallWaitCursor but resizable |
| [RestrictedAccordion](/src/components/restricted-accordion/RestrictedAccordion.jsx)| Accordion with lock-icon for admins |
| [SuspenseWaitCursor](/src/components/other/SuspenseWaitCursor.jsx)| Suspense-Component that provides a fallback for React lazy loading |
| [TextStringComplex](/src/textstring/TextStringMemo.jsx)| Memoized Textstring Component, adds prefix. Allows complex replacements with JSX and CTRL+Click to edit |
| [TextStringMemo](/src/textstring/TextStringMemo.jsx)| Memoized Textstring Component, adds prefix |
| [UACGroupChooseButton](/src/components/buttons/UACGroupChooseButton.jsx)| ChooseButton for UAC groups |

###Hooks
| Hook                                                                 | Description                   |
|----------------------------------------------------------------------|-------------------------------|
| [useElementProps](/src/hooks/useElementProps.js)| Remove custom props to spread the remaining props on an HTML element |
| [useFullscreenTapp](/src/hooks/useFullscreenTapp.js)| Hook to create a fullscreen tapp without scrolling |
| [useFunctionState](/src/hooks/useFunctionState.js)| useState that can contain a function directly |
| [useRefresh](/src/hooks/useRefresh.js)| generates a random ID in an interval to force re-render |
| [useTest](/src/hooks/useOnce.js)| test a short script inside your component |
| [useTextStrings](/src/textstring/TextStringMemo.jsx)| get memoized TextStrings from a list of string names |
| [useTimeoutState](/src/hooks/uniques/useTimeoutState.js)| useState that calls an onChange method if the value hasn't change for a certain time |
| [useUniqueEventListener](/src/hooks/uniques/useUniqueEventListener.js)| removes an old eventListener when a new one is set |
| [useUniqueInterval](/src/hooks/uniques/useUniqueInterval.js)| clears a previous interval when a new one is set |
| [useUniqueTimeout](/src/hooks/uniques/useUniqueTimeout.js)| clears a previous timeout when a new one is set |
| [useUser](/src/hooks/useUser.js)| chayns.getUser() hook |
| [useWebsocketService](/src/hooks/useWebsocketService.js)| configure a tobit-websocket-service-client |
| [useShallowSelector](/src/hooks/useShallowSelector.js)| a useSelector Hook with shallowEqual |
| [useAxis](/src/functions/recharts/useAxis.js)| a hook to generate a better recharts axis |


###Functions
| Function                                                                 | Description                   |
|----------------------------------------------------------------------|-------------------------------|
| [backgroundColorClass](/src/functions/chaynsColors.js)| get a chayns background color class name |
| [borderColorClass](/src/functions/chaynsColors.js)| get a chayns border color class name |
| [chaynsDialogs](/src/functions/chaynsDialogs.js)| makes using chayns dialogs so much more comfortable |
| [colorClass](/src/functions/chaynsColors.js)| get a chayns color class name |
| [copyOnClick](/src/functions/copy.js)| copy a value to the user's clipboard |
| [defaultErrorHandler](/src/functions/defaultErrorHandler.js)| default request error handling with dialogs for error status codes |
| [fnsFormat](/src/functions/timeHelper.js)| datefns format with option to use today/tomorrow/yesterday |
| [formatDate](/src/functions/timeHelper.js)| Format date: [Gestern/Heute/Morgen/12.3./12.3.2019], HH:mm Uhr |
| [formatDateText](/src/functions/timeHelper.js)| Format date: [gestern/heute/mMorgen/am 12.3./am 12.3.2019] um HH:mm Uhr |
| [getChaynsColor](/src/functions/chaynsColors.js)| get a chayns color in hex from its color name |
| [getChaynsColorRgb](/src/functions/chaynsColors.js)| get a chayns color in rgb from its color name |
| [handleRequest](/src/functions/httpRequest.js)| try/catch-wrapper for http requests |
| [hexToRgb](/src/functions/chaynsColors.js)| convert hex color string to rgb |
| [hideCWFooter](/src/functions/chaynsCalls/chaynsCalls.js)| hide the chayns web footer |
| [httpRequest](/src/functions/httpRequest.js)| fetch helper with loads of options |
| [localStorage](/src/other/localStorageHelper.js)| helper to cache httpRequest JSON strings in local storage |
| [mixChaynsColorRgb](/src/functions/chaynsColors.js)| mix 2 chayns colors |
| [removeTimeZoneOffset](/src/functions/timeHelper.js)| Remove timezone offset of dates that claim to be UTC but are actually local |
| [RequestError](/src/functions/httpRequest.js)| Error class for error status codes |
| [setViewMode](/src/functions/chaynsCalls/chaynsCalls.js)| toggle exclusive mode |
| [showSuccessAnimation](/src/functions/statusAnimations/showSuccessAnimation.js)| show a dialog with a success animation |
| [simpleTimeFormat](/src/functions/timeHelper.js)| Format date: HH:mm |
| [time](/src/functions/timeHelper.js)| constant for times based on ms |
| [types](/src/functions/types.js)| a collection of helpers for types in general but especially objects and arrays. Includes: mapObject, reduceObject, mapObjectToArray, forEachKey, firstOrDefault, replaceAll, type checking |
| [waitCursor](/src/functions/waitCursor.js)| helper for chayns.showWaitCursor with a timeout before displaying |
| [WebSocketClient](/src/other/webSocketClient.js)| custom alternative to tobit-websocket-service-client |
| [generateAxis](/src/functions/recharts/generateAxis.js)| a function to generate a better recharts axis |










