// eslint-disable-next-line max-classes-per-file
import types from './types';
/**
 * The dialogs of this helper all have the parameters (message, buttons), (message, options, buttons) or (option,
 * buttons) The dialogs of this helper all return an object like this: { buttonType: -1|0|1, value: ... }, so all
 * results will have the keys "buttonType" and "value" Custom handlers based on buttonType: ButtonType 1:
 * chaynsDialog.dialog().positive(value => ...) ButtonType 0: chaynsDialog.dialog().negative(value => ...) ButtonType
 * -1: chaynsDialog.dialog().cancel(value => ...)
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
 * @enum
 */
export const buttonType = {
    CANCEL: -1,
    NEGATIVE: 0,
    POSITIVE: 1
};

export const createDialogResult = (type, value = undefined) => ({ buttonType: type, value });

/**
 * @callback fullResolveFn
 * @param {Object} result
 * @param {number} result.buttonType
 * @param {?*} result.value
 */

/**
 * @callback dialogThen
 * @param {function(*): *|void} resolveFn
 * @returns {DialogPromise<dialogResult>}
 */

/**
 * @callback fullDialogThen
 * @param {fullResolveFn} resolveFn
 * @returns {DialogPromise<dialogResult>}
 */

/**
 * Custom extension to Promise for dialogs
 * @extends Promise
 */
export class DialogPromise extends Promise {
    isPending = true;

    constructor(resolveFn) {
        super((resolve, reject) => {
            new Promise((res, rej) => {
                resolveFn(res, rej);
            }).then((result) => {
                this.isPending = false;
                resolve(result);
            }, (result) => {
                this.isPending = false;
                reject(result);
            });
        });
    }

    /**
     * @param {function(*): *|void} resolveFn
     * @returns {DialogPromise<dialogResult>}
     */
    positive(resolveFn) {
        super.then((result) => {
            if (result.buttonType === 1) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * @param {function(*): *|void} resolveFn
     * @returns {DialogPromise<dialogResult>}
     */
    negative(resolveFn) {
        super.then((result) => {
            if (result.buttonType === 0) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * @param {function(*): *|void} resolveFn
     * @returns {DialogPromise<dialogResult>}
     */
    cancelled(resolveFn) {
        super.then((result) => {
            if (result.buttonType === -1) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * close the dialog
     * @returns {boolean} success
     */
    abort() {
        if (this.isPending) {
            chayns.dialog.close();
            return true;
        }
        return false;
    }
}

/**
 * Custom extension to DialogPromise for the iFrame dialog
 * @extends DialogPromise
 */
export class IframeDialogPromise extends DialogPromise {
    /**
     * @param {function(*): *|void} resolveFn
     * @returns {DialogPromise<dialogResult>}
     */
    result(resolveFn) {
        chayns.dialog.addDialogResultListener(resolveFn);
        this.then(() => {
            chayns.dialog.removeDialogResultListener(resolveFn);
        });
        return this;
    }

    /**
     * @param {function(*): *|void} resolveFn
     * @param {boolean} getApiEvents - get sent data that has isApiEvent set
     * @returns {DialogPromise<dialogResult>}
     */
    data(resolveFn, getApiEvents) {
        chayns.dialog.addDialogDataListener(resolveFn, getApiEvents);
        this.then(() => {
            chayns.dialog.removeDialogDataListener(resolveFn, getApiEvents);
        });
        return this;
    }
}

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
 * @param {Object} [options={}]
 * @param {string} [options.title='']
 * @return {DialogPromise<dialogResult>}
 */
export const alert = (message, options) => new DialogPromise((resolve) => {
    chayns.dialog.alert(options?.title || '', message ?? '')
        .then((type) => {
            resolve(createDialogResult(type));
        });
});

/**
 * Confirm dialog
 * @param {string} [message='']
 * @param {button[]} [buttons=undefined]
 * @param {Object} [options={}]
 * @param {string} [options.title='']
 * @return {DialogPromise<dialogResult>}
 */
export const confirm = (message, options, buttons) => new DialogPromise((resolve) => {
    chayns.dialog.confirm(options?.title || '', message ?? '', buttons)
        .then((type) => {
            resolve(createDialogResult(type));
        });
});

/**
 * Type for input dialog
 * @type {{NUMBER: number, TEXTAREA: number, INPUT: number, PASSWORD: number}}
 * @enum
 */
export const inputType = {
    PASSWORD: chayns.dialog.inputType.PASSWORD,
    TEXTAREA: chayns.dialog.inputType.TEXTAREA,
    INPUT: chayns.dialog.inputType.INPUT,
    NUMBER: chayns.dialog.inputType.NUMBER
};

/**
 * Input dialog
 * @param {Object} [options={}]
 * @param {string} [options.message='']
 * @param {string} options.title
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
 *
 * @property {inputType} type
 *
 * @return {DialogPromise<dialogResult>}
 */
export function input(options, buttons) {
    return new DialogPromise((resolve) => {
        chayns.dialog.input({
            title: options?.title,
            message: options?.message ?? '',
            placeholderText: options?.placeholderText,
            text: options?.text,
            textColor: options?.textColor,
            buttons,
            type: options?.type,
            regex: options?.regex,
            formatter: options?.formatter,
            pattern: options?.pattern,
            disableButtonTypes: options?.disableButtonTypes
        })
            .then(({ buttonType: type, text }) => {
                resolve(createDialogResult(type, text));
            });
    });
}

input.type = { ...inputType };

/**
 * select dialog type
 * @type {{ICON: number, DEFAULT: number}}
 * @enum
 */
export const selectType = {
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
 * @param {Object} [options]
 * @param {string} [options.message='']
 * @param {string} [options.title='']
 * @param {selectListItem[]} options.list
 * @param {boolean} [options.multiselect]
 * @param {boolean|null} [options.quickfind]
 * @param {selectType} [options.type] - one of chaynsDialog.selectType
 * @param {boolean} [options.preventCloseOnClick]
 * @param {?string} [options.selectAllButton] - add a checkbox with this prop as label that (de)selects all elements at
 *     once
 * @param {button[]} [buttons=undefined]
 *
 * @property {selectType} type
 *
 * @return {DialogPromise<dialogResult>}
 */
export function select(options, buttons) {
    return new DialogPromise((resolve) => {
        const {
            message = '',
            title = '',
            list = null,
            multiselect = false,
            quickfind = null,
            preventCloseOnClick = false,
            type = selectType.DEFAULT,
            selectAllButton = null
        } = options || {};
        chayns.dialog.select({
            title,
            message,
            list,
            multiselect,
            quickfind: quickfind === null ? types.length(list) > 5 : quickfind,
            type,
            preventCloseOnClick,
            buttons,
            selectAllButton
        })
            .then((result) => {
                const { buttonType: bType, selection } = result;
                if (!multiselect && selection && selection?.length === 1) {
                    const { name, value } = types.safeFirst(selection);
                    resolve(createDialogResult(bType, { name, value }));
                } else if (!multiselect) {
                    resolve(createDialogResult(bType, null));
                }
                if (multiselect && selection && selection?.length > 0) {
                    resolve(createDialogResult(bType, selection));
                } else {
                    resolve(createDialogResult(bType, []));
                }
            });
    });
}

select.type = { ...selectType };

export const validateDate = (param, allowMissingValue = true) => {
    if (allowMissingValue && (param === null || param === undefined)) return param;
    if (chayns.utils.isDate(param)) {
        return param;
    }
    if (chayns.utils.isString(param)) {
        try {
            return new Date(param);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[ChaynsDialog] date parameter of type string could not be parsed as Date');
            return undefined;
        }
    }
    if (chayns.utils.isFunction(param)) {
        try {
            const date = param();
            if (chayns.utils.isDate(date)) return date;
            // eslint-disable-next-line no-console
            console.error('[ChaynsDialog] date parameter of type function did not return a date');
            return undefined;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[ChaynsDialog] date parameter of type function failed to execute');
            return undefined;
        }
    }
    if (types.isInteger(param)) {
        try {
            return new Date(param);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[ChaynsDialog] date parameter of type number could not be parsed as Date');
            return undefined;
        }
    }
    // eslint-disable-next-line no-console
    console.error(
        '[ChaynsDialog] date parameter type invalid. Allowed types: number, dateString, Date, function: Date'
    );
    return undefined;
};

export const validateDateArray = (paramArray) => paramArray?.map((p) => validateDate(p, false) ?? undefined);

/**
 * @typedef intervalObject
 * @property {Date} start
 * @property {Date} end
 */
/**
 * text block position
 * @type {{ABOVE_SECOND: number, ABOVE_FIRST: number, ABOVE_THIRD: number}}
 * @enum
 */
export const textBlockPosition = {
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
 * @enum
 */
export const dateType = {
    DATE: chayns.dialog.dateType.DATE,
    TIME: chayns.dialog.dateType.TIME,
    DATE_TIME: chayns.dialog.dateType.DATE_TIME
};

/**
 * Method of selection
 * @type {{INTERVAL: number, SINGLE: number, MULTISELECT: number}}
 * @enum
 */
export const dateSelectType = {
    SINGLE: 0,
    MULTISELECT: 1,
    INTERVAL: 2
};

/**
 * Get the values for a dateSelectType
 * @param {dateSelectType|number} type
 * @return {{multiselect: boolean, minInterval: *, interval: boolean, maxInterval: *}|{multiselect: boolean,
 *     minInterval: *, interval: boolean, maxInterval: *}|{multiselect: boolean, interval: boolean}|{multiselect:
 *     boolean, minInterval: undefined, interval: boolean, maxInterval: undefined}}
 */
export const resolveDateSelectType = (type) => ([
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
][type || 0]);

/**
 * @typedef weekDayIntervalItem
 * @property {date} [start=0] - time since 0:00 in minutes
 * @property {date} [end=1440] - time since 0:00 in minutes
 */

/**
 * Advanced date dialog.
 * Prefer to use new prop "selectType" to use single/interval/multiselect
 * @param {Object} [options={}]
 * @param {string} [options.message='']
 * @param {string} [options.title='']
 * @param {dateType} [options.dateType] - one of chaynsDialog.dateType
 * @param {dateSelectType|number} [options.selectType] - one of chaynsDialog.dateSelectType
 * @param {Date|number|string|function} [options.minDate]
 * @param {Date|number|string|function} [options.maxDate]
 * @param {number} [options.minuteInterval]
 * @param {Date|number|string|Date[]|number[]|string[]|intervalObject} [options.preSelect] - a preselected date or an
 *     array of preselected dates
 * @param {boolean} [options.multiselect] - select multiple date, exclusive with {@link options.interval}
 * @param {Date[]|number[]|string[]} [options.disabledDates] - array of disabled dates
 * @param {textBlock[]} [options.textBlocks] - text blocks that are displayed between date select and time select
 * @param {boolean} [options.yearSelect]
 * @param {boolean} [options.monthSelect]
 * @param {boolean} [options.interval] - select date intervals, exclusive with {@link options.multiselect}
 * @param {?number} [options.minInterval] - minimum number of minutes per interval
 * @param {?number} [options.maxInterval] - maximum number of minutes per interval
 * @param {intervalObject[]} [options.disabledIntervals]
 * @param {weekDayIntervalItem[][7]} [options.disabledWeekDayIntervals] - array of {@link weekDayIntervalItem} with
 *     a[0] = monday, a[1] = tuesday...
 * @param {button[]} [buttons=undefined]
 *
 * @property {dateType} type
 * @property {dateSelectType} selectType
 * @property {textBlockPosition} textBlockPosition
 *
 * @return {DialogPromise<dialogResult>} returnValue - Format:
 *  { buttonType, value }
 *  value:
 *      SINGLE: Date
 *      MULTISELECT: Date[]
 *      INTERVAL: Date[2]
 */
export function advancedDate(options, buttons) {
    return new DialogPromise((resolve) => {
        const {
            message = '',
            title = '',
            dateType: pDateType = dateType.DATE_TIME,
            selectType: pSelectType = dateSelectType.SINGLE,
            minDate = 0,
            maxDate = null,
            minuteInterval = 1,
            preSelect = new Date(),
            multiselect = false,
            disabledDates = null,
            textBlocks = null,
            yearSelect = false,
            monthSelect = false,
            interval = false,
            minInterval = null,
            maxInterval = null,
            disabledIntervals = null,
            disabledWeekDayIntervals = null,
            getLocalTime = false
        } = options || {};
        const dialogSelectType = (
                pSelectType !== undefined
                && Object.values(dateSelectType).includes(pSelectType) ? pSelectType : null)
            ?? (multiselect
                ? dateSelectType.MULTISELECT
                : null)
            ?? (interval
                ? dateSelectType.INTERVAL
                : null)
            ?? dateSelectType.SINGLE;

        chayns.dialog.advancedDate({
            title,
            message,
            buttons,
            dateType: pDateType,
            minDate: validateDate(minDate),
            maxDate: validateDate(maxDate),
            minuteInterval,
            preSelect: chayns.utils.isArray(preSelect)
                       ? validateDateArray(preSelect)
                       : chayns.utils.isObject(preSelect)
                         && preSelect?.start
                         && preSelect?.end
                         ? { start: validateDate(preSelect?.start), end: validateDate(preSelect?.end), }
                         : validateDate(preSelect),
            disabledDates: validateDateArray(disabledDates),
            textBlocks,
            yearSelect,
            monthSelect,
            minInterval,
            maxInterval,
            disabledIntervals,
            disabledWeekDayIntervals,
            getLocalTime,
            ...resolveDateSelectType(dialogSelectType)
        })
            .then((result) => {
                // result from chayns dialog
                // single date: { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }] }
                // multiselect : { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }, ...] }
                // interval : { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }, { isSelected:
                // true, timestamp: ... in s }] }
                const { buttonType: type, selectedDates } = result;

                const validDates = (selectedDates || []).map((d) => ({
                    ...(d ?? {}),
                    timestamp: d?.timestamp ? new Date(d.timestamp) * 1000 : d?.timestamp
                }));

                if (dialogSelectType === dateSelectType.SINGLE) {
                    const selectedDate = types.safeFirst(validDates);
                    resolve(createDialogResult(type, selectedDate));
                } else if (dialogSelectType !== dateSelectType.SINGLE) {
                    resolve(createDialogResult(type, validDates));
                }
            });
    });
}

advancedDate.type = { ...dateType };
advancedDate.selectType = { ...dateSelectType };
advancedDate.textBlockPosition = { ...textBlockPosition };

/**
 * Select an image from Pixabay
 * @param {Object} [options={}]
 * @param {string} [options.title]
 * @param {string} [options.message]
 * @param {boolean} [options.multiselect]
 * @param {button[]} [buttons]
 * @returns {DialogPromise<dialogResult>}
 */
export function mediaSelect(options, buttons) {
    return new DialogPromise((resolve) => {
        const {
            title = '',
            message = '',
            multiselect = false
        } = options || {};
        chayns.dialog.mediaSelect({
            title,
            message,
            multiSelect: multiselect,
            buttons
        })
            .then((result) => {
                resolve(createDialogResult(result?.buttonType, result?.selection));
            });
    });
}

/**
 * fileTypes
 * @type {{IMAGE: string, VIDEO: string, DOCUMENT: string[], AUDIO: string}}
 */
export const fileType = {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: [
        'application/x-latex',
        'application/x-tex',
        'text/',
        'application/json',
        'application/pdf',
        'application/msword',
        'application/msexcel',
        'application/mspowerpoint',
        'application/vnd.ms-word',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument',
        'application/vnd.oasis.opendocument'
    ]
};

/**
 * Upload and select a file from chayns space
 * @param {Object} [options={}]
 * @param {string} [options.title]
 * @param {string} [options.message]
 * @param {boolean} [options.multiselect]
 * @param {fileType[]} [options.contentType]
 * @param {fileType[]} [options.exclude]
 * @param {boolean} [options.directory]
 * @param {button[]} [buttons]
 */
export function fileSelect(
    options, buttons = undefined
) {
    return new DialogPromise((resolve) => {
        const {
            title = '',
            message = '',
            multiselect = false,
            contentType = [],
            exclude = [],
            directory = false
        } = options || {};
        chayns.dialog.fileSelect({
            title,
            message,
            multiselect,
            buttons,
            contentType,
            exclude,
            directory
        })
            .then((result) => {
                resolve(createDialogResult(result?.buttonType, result?.selection));
            });
    });
}

/**
 * IFrame Dialog
 * Possible Usage:
 * const { buttonType } = await chaynsDialog.iFrame({ url, ...config }, buttons)
 *      .data(dialogDataListener)
 *      .result(dialogResultListener)
 *      .positive(positiveButtonTypeListener)
 * @param {Object} options
 * @param {string} options.url
 * @param {?Object|*} [options.input=null]
 * @param {boolean} [options.seamless=true]
 * @param {boolean} [options.transparent=false]
 * @param {boolean} [options.waitCursor=true]
 * @param {?string} [options.maxHeight=null]
 * @param {?number} [options.width=null]
 * @param {?number} [options.customTransitionTimeout=null]
 * @param {?button[]} [buttons=[]]
 * @returns {IframeDialogPromise<dialogResult>}
 */
export function iFrame(options, buttons) {
    return new IframeDialogPromise((resolve) => {
        const {
            url,
            input: dialogInput = null,
            seamless = true,
            transparent = false,
            waitCursor = true,
            maxHeight = null,
            width = null,
            customTransitionTimeout = null
        } = options || {};
        chayns.dialog.iFrame({
            url,
            input: dialogInput,
            buttons: buttons ?? [],
            seamless,
            transparent,
            waitCursor,
            maxHeight,
            width,
            customTransitionTimeout
        }).then((result) => {
            resolve(createDialogResult(result.buttonType, result?.value));
        });
    });
}

const chaynsDialog = {
    alert,
    confirm,
    input,
    iFrame,
    select,
    advancedDate,
    fileSelect,
    mediaSelect,
    fileType,
    buttonType,
    inputType,
    selectType,
    textBlockPosition,
    dateType,
    dateSelectType
};

export default chaynsDialog;
