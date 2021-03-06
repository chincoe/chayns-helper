import { WeekDayIntervalObject } from 'chayns-doc';
import DialogPromise from '../DialogPromise';
import { createDialogResult, DialogButton, DialogResult } from '../utils';

export const validateDate = (param: unknown | unknown[], allowMissingValue = true): Date | unknown => {
    if (allowMissingValue && (param === null || param === undefined)) return param;
    if (Object.prototype.toString.call(param) === '[object Date]') {
        return param;
    }
    if (typeof (param) === 'string') {
        try {
            return new Date(param);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[ChaynsDialog] date parameter of type string could not be parsed as Date');
            return undefined;
        }
    }
    if (typeof (param) === 'function') {
        try {
            const date = param();
            if (Object.prototype.toString.call(date) === '[object Date]') return date;
            // eslint-disable-next-line no-console
            console.error('[ChaynsDialog] date parameter of type function did not return a date');
            return undefined;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[ChaynsDialog] date parameter of type function failed to execute');
            return undefined;
        }
    }
    if (typeof (param) === 'number') {
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

export const validateDateArray = (paramArray: Array<unknown>): Array<Date | unknown> => paramArray?.map(
    (p) => validateDate(p, false) ?? undefined
);

export interface DateIntervalObject {
    start: Date;
    end: Date;
}

export enum textBlockPosition {
    ABOVE_FIRST = 0,
    ABOVE_SECOND = 1,
    ABOVE_THIRD = 2
}

export interface DialogTextBlock {
    headline: string;
    text: string;
    position: number | textBlockPosition;
}

export enum dateType {
    DATE = 1,
    TIME = 2,
    DATE_TIME = 3
}

export enum dateSelectType {
    SINGLE = 0,
    MULTISELECT = 1,
    INTERVAL = 2
}

export const resolveDateSelectType = (type?: number): Partial<{
    multiselect: boolean,
    interval: boolean,
    minInterval: undefined,
    maxInterval: undefined
}> => ([
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

type DateInformation = Date | number | string | (() => Date);

/**
 * Values in minutes since 0:00
 */
export interface WeekDayIntervalItem {
    start?: number;
    end?: number;
}

export interface AdvancedDateDialogConfig {
    message?: string;
    title?: string;
    dateType?: dateType | number;
    selectType?: dateSelectType | number;
    minDate?: DateInformation;
    maxDate?: DateInformation;
    minuteInterval?: number;
    preSelect?: DateInformation | Date[] | number[] | string[] | DateIntervalObject;
    multiselect?: boolean;
    disabledDates?: Array<DateInformation>;
    textBlocks?: Array<DialogTextBlock>;
    yearSelect?: boolean;
    monthSelect?: boolean;
    interval?: boolean;
    minInterval?: number;
    maxInterval?: number;
    disabledIntervals?: Array<DateIntervalObject>;
    disabledWeekDayIntervals: Array<WeekDayIntervalItem>[7];
    getLocalTime?: boolean;
}

export interface AdvancedDateDialogResult {
    timestamp: Date;
}

/**
 * Improved chayns.dialog.advancedDate. Works almost identically, but the timestamp in s conversion has been fixed to
 * be timestamps in ms and multiselect/interval are now exclusive
 * @param options
 * @param options.message
 * @param options.title
 * @param options.dateType
 * @param options.selectType - Single(0), Multiselect(1) or Interval(2)
 * @param options.minDate
 * @param options.maxDate
 * @param options.minuteInterval
 * @param options.preSelect
 * @param options.multiselect - deprecated, please use selectType parameter instead
 * @param options.disabledDates
 * @param options.textBlocks
 * @param options.yearSelect
 * @param options.monthSelect
 * @param options.interval - deprecated, please use selectType parameter instead
 * @param options.minInterval
 * @param options.maxInterval
 * @param options.disabledIntervals
 * @param options.disabledWeekDayIntervals
 * @param options.getLocalTime
 * @param buttons
 */
export default function advancedDate(
    options?: AdvancedDateDialogConfig,
    buttons?: Array<DialogButton>
): DialogPromise<AdvancedDateDialogResult | AdvancedDateDialogResult[]> {
    return new DialogPromise<AdvancedDateDialogResult | AdvancedDateDialogResult[]>(
        (resolve: (value: DialogResult<AdvancedDateDialogResult | AdvancedDateDialogResult[]>) => unknown) => {
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
                minInterval = undefined,
                maxInterval = undefined,
                disabledIntervals = undefined,
                disabledWeekDayIntervals = undefined,
                getLocalTime = false
            } = options || {};
            // get date select type based on selectType, multiselect, interval and the default (in this order)
            const dialogSelectType = (
                pSelectType !== undefined
                && Object.values(dateSelectType).includes(<number>pSelectType) ? pSelectType : null
            ) ?? (
                multiselect
                    ? dateSelectType.MULTISELECT
                    : null
            ) ?? (
                interval
                    ? dateSelectType.INTERVAL
                    : null
            ) ?? dateSelectType.SINGLE;
            let preSelectData;
            if (Array.isArray(preSelect)) {
                preSelectData = validateDateArray(preSelect) as Date[];
            } else {
                preSelectData = Object.prototype.toString.call(preSelect) === '[object Object]'
                && (<DateIntervalObject>preSelect)?.start
                && (<DateIntervalObject>preSelect)?.end
                    ? {
                        start: validateDate((<DateIntervalObject>preSelect)?.start) as Date,
                        end: validateDate((<DateIntervalObject>preSelect)?.end) as Date,
                    }
                    : validateDate(preSelect) as Date;
            }
            chayns.dialog.advancedDate({
                title,
                message,
                buttons,
                dateType: pDateType,
                minDate: validateDate(minDate) as Date,
                maxDate: validateDate(maxDate) as Date,
                minuteInterval,
                preSelect: preSelectData,
                disabledDates: validateDateArray(<Array<DateInformation>>disabledDates) as Date[],
                textBlocks: textBlocks as DialogTextBlock[],
                yearSelect,
                monthSelect,
                minInterval,
                maxInterval,
                disabledIntervals,
                disabledWeekDayIntervals: disabledWeekDayIntervals as WeekDayIntervalObject,
                getLocalTime,
                ...resolveDateSelectType(<number>dialogSelectType)
            }).then(
                (result: { buttonType: number, selectedDates?: Array<{ timestamp: number, isSelected: boolean }> }) => {
                    // result from chayns dialog
                    // single date: { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }] }
                    // multiselect : { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }, ...] }
                    // interval : { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }, { isSelected:
                    // true, timestamp: ... in s }] }
                    const { buttonType: type, selectedDates } = result;

                    const validDates = (selectedDates || []).map((d) => ({
                        ...(d ?? {}),
                        timestamp: d?.timestamp ? new Date(d.timestamp * 1000) : d?.timestamp
                    }));

                    if (dialogSelectType === dateSelectType.SINGLE) {
                        const selectedDate = validDates[0] ?? null;
                        resolve(createDialogResult(type, selectedDate as AdvancedDateDialogResult));
                    } else if (dialogSelectType !== dateSelectType.SINGLE) {
                        resolve(createDialogResult(type, validDates as AdvancedDateDialogResult[]));
                    }
                }
            );
        }
    );
}

advancedDate.type = { ...dateType };
advancedDate.selectType = { ...dateSelectType };
advancedDate.textBlockPosition = { ...textBlockPosition };
