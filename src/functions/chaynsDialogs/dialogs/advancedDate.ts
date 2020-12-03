import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

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
    if (chayns.utils.isNumber(param)) {
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
export default function advancedDate(options, buttons) {
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
                    const selectedDate = validDates[0] ?? null;
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
