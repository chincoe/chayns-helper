## chaynsDialogs
The chayns-js dialogs can be somewhat complicated to use.
Unintuitive return values as well as unexpected behavior such as timestamps in seconds often force you to transform your input and output to fit the dialog.
This helper aims to solve this problem by wrapping all chayns dialogs to allow a more consistent experience.

### Basic Improvements
Most parameters and features of the chayns dialogs remain the same. Please consult the [chayns-js wiki](https://github.com/TobitSoftware/chayns-js/wiki/Dialogs) for the full documentation.
However, the following aspects are changed by this helper.

#### Code completion
The Typescript definitions enable code completion for all the dialog properties

#### Return values
All dialogs return promises that resolve to an Object formatted like this:
```javascript
{ buttonType: number, value: any }
```
The keys `buttonType` and `value` are guaranteed to be present to allow destructuring, though `value` may be `undefined`.

#### Parameters
Parameters remain largely unchanged.
In general all dialog calls have parameters like this:
```javascript
// alert
chaynsDialog.dialogName(message, options);
// confirm
chaynsDialog.dialogName(message, options, buttons);
// others
chaynsDialog.dialogName(options, buttons);
```

##### Title
All dialogs that have the title as separate parameter have the title moved to the options object.
This is the result of the title parameter being largely unused and mostly just left blank.

##### Buttons
Buttons are always a separate parameter and always optional.

##### Dates
All dates validated on input and can be a Date, dateString, or a timestamp in ms.
All return values are Dates.

#### Enums
All chayns dialog enums (like `chayns.dialog.buttonType`) are exported by this helper as well for ease of use.

#### Exports 
All dialogs are exported both as `chaynsDialog.[name]` and `[name]Dialog`.

### Additional result handlers
Working with chayns dialogs, often times we just want to handle successful dialogs that resolved with `buttonType === 1`.
This checking for such buttonTypes is somewhat redundant, so this helper adds a few custom handlers that are only called on certain buttonTypes.

Each promise returned from this helper implements the following methods in addition to `.then`, `.catch` and `.finally`:
* `.positive(callback)`: The callback receives the value and is executed if `buttonType === 1`.
* `.negative(callback)`: The callback receives the value and is executed if `buttonType === 0`.
* `.cancelled(callback)`: The callback receives the value and is executed if `buttonType === -1`.

Note that these callbacks will only receive the value, not the object that includes the buttonType.

**NOTE**: Unlike with regular promises, these handlers all return the original `DialogPromise`.
Because `.then()` is a default Promise function, you **cannot call any of the custom handlers after using `.then`, `.catch` or `.finally`**.
You can however call `.then` etc. after a custom handler.
Due to this implementation any value any of the callbacks returns will be ignored.
You may however chain as many custom handlers as you want - even more than one per buttonType.

The dialog promise is also extended by a method called `abort()` which will close the dialog with `buttonType -1` if the dialog has not been resolved yet.

##### Example
```javascript
// usage:
chaynsDialog.confirm('Do you want to confirm?')
    .positive((value) => { console.log('User has confirmed!') })
    .negative((value) => { console.log('User has declined!') })
    .cancelled((value) => { console.log('User has cancelled!') })
    .then(({buttonType, value}) => { console.log(buttonType, value) })

// won't work because .then() is called before the custom handlers:
chaynsDialog.confirm('Do you want to confirm?')
    .then(({buttonType, value}) => { console.log(buttonType, value) })
    .positive((value) => { console.log('User has confirmed!') })
    .negative((value) => { console.log('User has declined!') })
    .cancelled((value) => { console.log('User has cancelled!') })
```

### Specific Dialogs

#### iFrame
The iFrame DialogPromise has 2 additional custom handlers:
* `.result(callback)`: Add a chayns dialogResultListener that is removed after the dialog ends.
* `.data(callback, getApiEvents)`: Add a chayns dialogDataListener that is removed after the dialog ends.

#### advancedDate
The advancedDate dialog of this helper can be used like the chayns.dialog advanced date dialog.
This helper implements an additional property `options.selectType` of type `chaysDialog.advancedDate.dateSelectType`.
This property is meant to replace `multiselect` and `interval` in a way that makes them mutually exclusive.
The 3 dateSelectTypes are SINGLE, MULTISELECT and INTERVAL - 0, 1 and 2 respectively.

#### date
This helper does not implement the chayns.dialog.date dialog as it offers no feature that cannot be implemented with advancedDate.

#### status(statusType, options)
Additional dialog that displays a status animation either as confirm or alert dialog. Has different parameters:

| Parameter | Description | Type | Required/Default |
|-----------|-------------|------|------------------|
| statusType | Dialog status, determines which animation to show | `'SUCCESS'`/`'WARNING'`/`'ERROR'` | required |
| options.message | additional html string to be displayed below the animation | string | `''` |
| options.dialog | name of the dialog to use | `'alert'`/`'confirm'` | `'alert'` |
| options.buttons | dialog buttons extended by an `onClick` function that will be called if that button is pressed | { buttonType: number, text: string, onClick?: function } | `null` |
