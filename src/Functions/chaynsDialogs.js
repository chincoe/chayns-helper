import types from './types';
/**
 * This dialog helper cleans up the mess that chayns.js dialogs can be at times:
 * - more consistent parameters
 * - more consistent return values
 * - more comfortable to use
 *
 * The dialogs of this helper all have the parameters (message, buttons) or (message, option, buttons)
 * The dialogs of this helper all return an object like this: { buttonType: -1|0|1, value: ... }, so all results will
 * have the keys "buttonType" and "value"
 * Custom handlers based on buttonType:
 * ButtonType 1: chaynsDialog.dialog().positive(value => ...)
 * ButtonType 0: chaynsDialog.dialog().negative(value => ...)
 * ButtonType -1: chaynsDialog.dialog().cancel(value => ...)
 *
 * General: chaynsDialog.dialog().then(({ buttonType, value }) => ...)
 * or: const { buttonType, value } = await chaynsDialog.dialog();
 */

/**
 * Type of dialog buttons
 * @type {{POSITIVE: number, CANCEL: number, NEGATIVE: number}}
 */

/**
 * possible button Types
 * @type {{POSITIVE: number, CANCEL: number, NEGATIVE: number}}
 */
const buttonType = {
    CANCEL: -1,
    NEGATIVE: 0,
    POSITIVE: 1
};

const createDialogResult = (type, value = undefined) => ({ type, value });

/**
 * @typedef dialogResult
 * @property {buttonType} buttonType
 * @property {*} value
 */
/**
 * @typedef button
 * @property {string} text
 * @property {buttonType} buttonType
 * @property {number} collapseTime - time in seconds after which this options is selected automatically
 * @property {string} textColor
 * @property {string} backgroundColor
 */

/**
 * Alert dialog with only one button
 * @param {string} [message='']
 * @return {dialogResult|Dialog|Promise<dialogResult>}
 */
const alert = (message = '') => new Dialog(async () => new Promise((resolve) => {
    chayns.dialog.alert('', message)
        .then((type) => {
            resolve(createDialogResult(type));
        });
}));

/**
 * Confirm dialog
 * @param {string} [message='']
 * @param {button[]} [buttons=undefined]
 * @return {dialogResult|Dialog|Promise<dialogResult>}
 */
const confirm = (message = '', buttons = undefined) => new Dialog(async () => new Promise((resolve) => {
    chayns.dialog.confirm('', message, buttons)
        .then((type) => {
            resolve(createDialogResult(type));
        });
}));

/**
 * Type for input dialog
 * @type {{NUMBER: number, TEXTAREA: number, INPUT: number, PASSWORD: number}}
 */
const inputType = {
    PASSWORD: chayns.dialog.inputType.PASSWORD,
    TEXTAREA: chayns.dialog.inputType.TEXTAREA,
    INPUT: chayns.dialog.inputType.INPUT,
    NUMBER: chayns.dialog.inputType.NUMBER
};

/**
 * Input dialog
 * @param {string} [message='']
 * @param {Object} [options={}]
 * @param {string} options.placeholderText - placeholder
 * @param {string} options.text - default value
 * @param {string} options.textColor
 * @param {inputType} options.type - one of chaynsDialog.inputType
 * @param {string} options.regex
 * @param {function} options.formatter - function to format the input, {@link options.type} is required to use it
 * @param {string} options.pattern - pattern for input, can be used to get other keyboards (e.g. set to "[0-9]*" with
 *     number type for iOS)
 * @param {buttonType[]} options.disableButtonTypes - array of the buttonTypes that will be disabled if
 *     {@link options.regex} doesn't match the input
 * @param {button[]} [buttons=undefined]
 * @return {dialogResult|Dialog|Promise<dialogResult>}
 */
function input(message = '', options = {}, buttons = undefined) {
    this.type = { ...inputType };
    return new Dialog(async () => new Promise((resolve) => {
        chayns.dialog.input({
            title: '',
            message,
            placeholderText: options.placeholderText,
            text: options.text,
            textColor: options.textColor,
            buttons,
            type: options.type,
            regex: options.regex,
            formatter: options.formatter,
            pattern: options.pattern,
            disableButtonTypes: options.disableButtonTypes
        })
            .then(({ buttonType: type, text }) => {
                resolve(createDialogResult(type, text));
            });
    }));
}

/**
 * select dialog type
 * @type {{ICON: number, DEFAULT: number}}
 */
const selectType = {
    DEFAULT: chayns.dialog.selectType.DEFAULT,
    ICON: chayns.dialog.selectType.ICON
};
/**
 * @typedef selectListItem
 * @property {string} name
 * @property {string|number|Object} value
 * @property {string} backgroundColor
 * @property {string} className - fontawesome icon classname for ICON type
 * @property {string} url - iconUrl for ICON type
 * @property {boolean} isSelected - is selected by default
 */
/**
 * @typedef selectDialogResultItem
 * @property {string} name
 * @property {string|number|Object} value
 */

/**
 * @typedef selectDialogResult
 * @property {buttonType} buttonType
 * @property {selectDialogResultItem|selectDialogResultItem[]|null} value
 */
/**
 * Select dialog. Returns an array of selections as value (with multiselect) or the selected object as value (without
 * multiselect)
 * @param {string} [message='']
 * @param {Object} [options={}]
 * @param {selectListItem[]} options.list
 * @param {boolean} options.multiselect
 * @param {boolean} options.quickfind
 * @param {selectType} options.type - one of chaynsDialog.selectType
 * @param {boolean} options.preventCloseOnClick
 * @param {string} options.selectAllButton - add a checkbox with this prop as label that (de)selects all elements at
 *     once
 * @param {button[]} buttons
 * @return {selectDialogResult|Dialog|Promise<selectDialogResult>}
 */
function select(message = '', options = {}, buttons = []) {
    this.type = { ...selectType };
    return new Dialog(async () => new Promise((resolve) => {
        chayns.dialog.select({
            title: '',
            message,
            list: options.list,
            multiselect: options.multiselect,
            quickfind: options.quickfind,
            type: options.type,
            preventCloseOnClick: options.preventCloseOnClick,
            buttons,
            selectAllButton: options.selectAllButton
        })
            .then((result) => {
                const { buttonType: type, selection } = result;
                if (!options.multiselect && selection && selection.length === 1) {
                    const { name, value } = selection;
                    resolve(createDialogResult(type, { name, value }));
                } else if (!options.multiselect) {
                    resolve(createDialogResult(type, null));
                }
                if (options.multiselect && selection && selection.length > 0) {
                    resolve(createDialogResult(type, selection));
                } else {
                    resolve(createDialogResult(type, []));
                }
            });
    }));
}

const validateDate = (param, allowMissingValue = true) => {
    if (allowMissingValue && (param === null || param === undefined)) return param;
    if (types.isDate(param)) {
        return param;
    }
    if (types.isString(param)) {
        try {
            const date = new Date(param);
            return date;
        } catch (e) {
            console.notLive.error('[ChaynsDialog] date parameter of type string could not be parsed as Date');
            return undefined;
        }
    }
    if (types.isFunction(param)) {
        try {
            const date = param();
            if (types.isDate(date)) return date;
            console.notLive.error('[ChaynsDialog] date parameter of type function did not return a date');
            return undefined;
        } catch (e) {
            console.notLive.error('[ChaynsDialog] date parameter of type function failed to execute');
            return undefined;
        }
    }
    if (types.isInteger(param) && types.isCleanNumber(param)) {
        try {
            const date = new Date(param);
            return date;
        } catch (e) {
            console.notLive.error('[ChaynsDialog] date parameter of type number could not be parsed as Date');
            return undefined;
        }
    }
    console.notLive.error(
        '[ChaynsDialog] date parameter type invalid. Allowed types: timestamp: number, dateString: string, Date, function: Date'
    );
    return undefined;
};

const validateDateArray = (paramArray) => paramArray.map((p) => validateDate(p, false));

/**
 * @typedef intervalObject
 * @property {Date} start
 * @property {Date} end
 */
/**
 * text block position
 * @type {{ABOVE_SECOND: number, ABOVE_FIRST: number, ABOVE_THIRD: number}}
 */
const textBlockPosition = {
    ABOVE_FIRST: 0,
    ABOVE_SECOND: 1,
    ABOVE_THIRD: 2
};
/**
 * @typedef textBlock
 * @property {string} headline
 * @property {string} text
 * @property {textBlockPosition} position - 0: above first item; 1: above second item
 */

/**
 * date dialog type
 * @type {{DATE: number, TIME: number, DATE_TIME: number}}
 */
const dateType = {
    DATE: chayns.dialog.dateType.DATE,
    TIME: chayns.dialog.dateType.TIME,
    DATE_TIME: chayns.dialog.dateType.DATE_TIME
};

/**
 * Method of selection
 * @type {{INTERVAL: number, SINGLE: number, MULTISELECT: number}}
 */
const dateSelectType = {
    SINGLE: 0,
    MULTISELECT: 1,
    INTERVAL: 2
};

/**
 * Get the values for a dateSelectType
 * @param {dateSelectType} type
 * @return {{multiselect: boolean, minInterval: *, interval: boolean, maxInterval: *}|{multiselect: boolean,
 *     minInterval: *, interval: boolean, maxInterval: *}|{multiselect: boolean, interval: boolean}|{multiselect:
 *     boolean, minInterval: undefined, interval: boolean, maxInterval: undefined}}
 */
const resolveDateSelectType = (type) => [
    {
        multiselect: false,
        interval: false,
        minInterval: undefined,
        maxInterval: undefined
    },
    {
        multiselect: true,
        interval: false,
        minInterval: undefined,
        maxInterval: undefined
    },
    {
        multiselect: false,
        interval: true
    }
][type || 0];

/**
 * @typedef weekDayIntervalItem
 * @property {date} [start=0] - time since 0:00 in minutes
 * @property {date} [end=1440] - time since 0:00 in minutes
 */

/**
 * Advanced date dialog
 * @param {string} [message='']
 * @param {Object} [options={}]
 * @param {dateType} options.dateType - one of chaynsDialog.dateType
 * @param {dateSelectType} options.selectType - one of chaynsDialog.dateSelectType
 * @param {Date|number|string|function} options.minDate
 * @param {Date|number|string|function} options.maxDate
 * @param {number} options.minuteInterval
 * @param {Date|number|string|Date[]|number[]|string[]} options.preselected - a preselected date or an array of
 *     preselected dates
 * @param {boolean} options.multiselect - select multiple date, exclusive with {@link options.interval}
 * @param {Date[]|number[]|string[]} options.disabledDates - array of disabled dates
 * @param {Object[]} options.textBlocks - text blocks that are displayed between date select and time select
 * @param {boolean} options.yearSelect
 * @param {boolean} options.monthSelect
 * @param {boolean} options.interval - select date intervals, exclusive with {@link options.multiselect}
 * @param {number} options.minInterval - minimum number of minutes per interval
 * @param {number} options.maxInterval - maximum number of minutes per interval
 * @param {intervalObject[]} options.disabledIntervals
 * @param {weekDayIntervalItem[][7]} options.disabledWeekDayIntervals - array of {@link weekDayIntervalItem} with a[0]
 *     = monday, a[1] = tuesday...
 * @param {button[]} buttons
 * @return {dialogResult|Dialog|Promise<dialogResult>}
 */
function advancedDate(message = '', options = {}, buttons = []) {
    this.type = { ...dateType };
    this.selectType = { ...dateSelectType };
    this.textBlockPosition = { ...textBlockPosition };
    return new Dialog(async () => new Promise((resolve) => {
        const dialogSelectType = (options.selectType !== undefined && Object.values(dateSelectType).includes(
            options.selectType
            )
                                  ? options.selectType
                                  : null)
            ?? (options.multiselect
                ? dateSelectType.MULTISELECT
                : null)
            ?? (options.interval
                ? dateSelectType.INTERVAL
                : null)
            ?? dateSelectType.SINGLE;

        chayns.dialog.select({
            title: '',
            message,
            buttons,
            dateType: options.dateType,
            minDate: validateDate(options.minDate),
            maxDate: validateDate(options.maxDate),
            minuteInterval: options.minuteInterval,
            preselected: types.isArray(options.preselected)
                         ? validateDateArray(options.preselected)
                         : validateDate(options.preselected),
            disabledDates: validateDateArray(options.disabledDates),
            textBlocks: options.textBlocks,
            yearSelect: options.yearSelect,
            monthSelect: options.monthSelect,
            minInterval: options.minInterval,
            maxInterval: options.maxInterval,
            disabledIntervals: options.disabledIntervals,
            disabledWeekDayIntervals: options.disabledWeekDayIntervals,
            ...resolveDateSelectType(dialogSelectType)
        })
            .then((result) => {
                // single date: { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }] }
                // multiselect : { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }, ...] }
                // interval : { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }, { isSelected:
                // true, timestamp: ... in s }] }
                const { buttonType: type, selectedDates } = result;
                if (!selectedDates) {
                    if (dialogSelectType === 0) resolve(createDialogResult(type, null));
                    if (dialogSelectType !== 0) resolve(createDialogResult(type, []));
                }
                if (dialogSelectType === 0) {
                    const selectedDate = types.safeFirst(selectedDates);
                    resolve(createDialogResult(
                        type,
                        (selectedDate && selectedDate.timestamp ? new Date(selectedDate.timestamp * 1000) : null)
                    ));
                } else if (dialogSelectType !== 0) {
                    resolve(createDialogResult(
                        type, (selectedDates || []).map((d) => (d ? new Date(d.timestamp * 1000) : null))
                            .filter((d) => !!d)
                    ));
                }
            });
    }));
}

/**
 * Wrapper for dialogs to add custom handlers like .positive, .negative and .cancel
 * @param {function<Promise>} dialogFn - the async function that shows the dialog and returns the already formatted
 *     result Promise
 * @param {bool} [useCustomHandlers=true] - enables or disables custom handlers. Returns the promise if set to false
 * @return {*}
 * @constructor
 */
function Dialog(dialogFn, useCustomHandlers = true) {
    const handlers = {
        positive: null,
        negative: null,
        cancel: null,
        result: null
    };
    this.then = function (resultHandler) {
        if (types.isFunction(resultHandler)) {
            handlers.result = resultHandler;
        }
        return this;
    };
    this.positive = function (positiveHandler) {
        if (types.isFunction(positiveHandler)) {
            handlers.positive = positiveHandler;
        }
        return this;
    };
    this.negative = function (negativeHandler) {
        if (types.isFunction(negativeHandler)) {
            handlers.negative = negativeHandler;
        }
        return this;
    };
    this.cancel = function (cancelHandler) {
        if (types.isFunction(cancelHandler)) {
            handlers.cancel = cancelHandler;
        }
        return this;
    };

    const promise = new Promise((resolve, reject) => {
        (async () => {
            try {
                const result = await dialogFn();
                const { type, value } = result;
                switch (type) {
                    case -1:
                        if (types.isFunction(handlers.cancel)) {
                            handlers.cancel(value);
                        }
                        break;
                    case 0:
                        if (types.isFunction(handlers.negative)) {
                            handlers.negative(value);
                        }
                        break;
                    case 1:
                        if (types.isFunction(handlers.positive)) {
                            handlers.positive(value);
                        }
                        break;
                    default:
                        break;
                }
                if (types.isFunction(handlers.result)) handlers.result(result);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        })();
    });

    return useCustomHandlers ? this : promise;
}

function Subdialog(handler, value, executeHandler) {
    if (types.isFunction(handler)) {
        handler(value);
    }
    return this;
}

const chaynsDialog = {
    alert,
    confirm,
    input,
    select,
    advancedDate,
    buttonType,
    inputType,
    selectType,
    textBlockPosition,
    dateType,
    dateSelectType
};

export default chaynsDialog;
