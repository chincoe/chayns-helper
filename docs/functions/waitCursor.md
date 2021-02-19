## [WaitCursor](src/functions/waitCursor.ts)
A small helper to use chayns.showWaitCursor() with a timeout and/or multiple steps.
### Usage
```javascript
const hideWaitCursor = showWaitCursor(options, steps);
// do stuff
hideWaitCursor();
```

| Parameter     | Description          | Type | Default / required |
|---------------|----------------------|------|-----------|
| options.timeout | The timeout in ms before the waitCursor is displayed | number | `300`|
| options.textTimeout | The timeout in ms before text is shown in the wait cursor | number | `5000` |
| options.text | The text that is shown after the text timeout | string | `undefined`(results in chayns default) |
| options.action | The action name used for internal purposes | string | `'showWaitCursor'` |
| steps | An object with keys for textTimeout and values for texts to show several different texts at different times | Object<textTimeout, text> | `undefined` |
| **@returns** | The hideWaitCursor function to hide the waitCursor and clear the timeout | function() | |

### Example
```javascript
// usage with steps. When using steps, options.textTimeout and options.text only do anything if options.textTimeout is smaller than the smallest step timeout
const hideWaitCursor = showWaitCursor(
    { timeout: 200 }, // show the wait cursor after 200ms
    {
        1000: "Doing something for you...", // show this text 1000ms after the waitCursor is shown, e.g. 1200ms after calling the function
        4000: "This might take a while...", // show this text 4s after waitCursor is shown
        10000: "Sorry to keep you waiting, this should not take that long", // show this text 10s after waitCursor is shown
        15000: "This is taking too long, please make sure you have a sufficient internet connection" // show this text 15s after waitCursor is shown
    }
);
```
