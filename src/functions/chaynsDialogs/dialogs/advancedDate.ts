import DialogPromise from '../DialogPromise';
import { createDialogResult, DialogButton } from '../utils';

export const validateDate = (param: any | any[], allowMissingValue = true) => {
    if (allowMissingValue && (param === null || param === undefined)) return param;
    if (chayns.utils.isDate(param)) {
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

export const validateDateArray = (paramArray: Array<any>) => paramArray?.map(
    (p) => validateDate(p, false) ?? undefined);

export interface DateIntervalObject {
    start: Date;
    end: Date;
}

export enum textBlockPositionEnum {
    ABOVE_FIRST = 0,
    ABOVE_SECOND = 1,
    ABOVE_THIRD = 2
}

export const textBlockPosition = {
    ABOVE_FIRST: 0,
    ABOVE_SECOND: 1,
    ABOVE_THIRD: 2
}

export interface DialogTextBlock {
    headline: string;
    text: string;
    textBlockPosition: number | typeof textBlockPositionEnum
}

export enum dateTypeEnum {
    DATE = 1,
    TIME = 2,
    DATE_TIME = 3
}

export const dateType = {
    DATE: 1,
    TIME: 2,
    DATE_TIME: 3
}

export enum dateSelectTypeEnum {
    SINGLE = 0,
    MULTISELECT = 1,
    INTERVAL = 2
}

export const dateSelectType = {
    SINGLE: 0,
    MULTISELECT: 1,
    INTERVAL: 2
}

export const resolveDateSelectType = (type?: number) => ([
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
    dateType?: typeof dateTypeEnum | number;
    /**
     * Single(0), Multiselect(1) or Interval(2)
     */
    selectType?: typeof dateSelectTypeEnum | number;
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
    getLocalTime?: boolean
}

export interface AdvancedDateDialogResult {
    timestamp: number;
}

/**
 * Improved chayns.dialog.advancedDate. Works almost identically, but the timestamp in s conversion has been fixed to
 * be timestamps in ms and multiselect/interval are now exclusive
 * @param options
 * @param buttons
 */
export default function advancedDate(
    options?: AdvancedDateDialogConfig,
    buttons?: Array<DialogButton>
): DialogPromise<AdvancedDateDialogResult | AdvancedDateDialogResult[]> {
    return new DialogPromise<AdvancedDateDialogResult | AdvancedDateDialogResult[]>((resolve: (value?: any) => any) => {
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
        const dialogSelectType = (
                                     pSelectType !== undefined
                                     &&
                                     Object.values(dateSelectType).includes(<number>pSelectType) ? pSelectType : null)
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
            preSelect: Array.isArray(preSelect)
                ? validateDateArray(preSelect)
                : chayns.utils.isObject(preSelect)
                  && (<DateIntervalObject>preSelect)?.start
                  && (<DateIntervalObject>preSelect)?.end
                    ? {
                        start: validateDate((<DateIntervalObject>preSelect)?.start),
                        end: validateDate((<DateIntervalObject>preSelect)?.end),
                    }
                    : validateDate(preSelect),
            disabledDates: validateDateArray(<Array<DateInformation>>disabledDates),
            textBlocks,
            yearSelect,
            monthSelect,
            minInterval,
            maxInterval,
            disabledIntervals,
            disabledWeekDayIntervals,
            getLocalTime,
            ...resolveDateSelectType(<number>dialogSelectType)
        })
            .then((result: any) => {
                // result from chayns dialog
                // single date: { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }] }
                // multiselect : { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }, ...] }
                // interval : { buttonType, selectedDates: [{ isSelected: true, timestamp: ... in s }, { isSelected:
                // true, timestamp: ... in s }] }
                const { buttonType: type, selectedDates } = result;

                const validDates = (selectedDates || []).map((d: any) => ({
                    ...(d ?? {}),
                    timestamp: d?.timestamp ? new Date(d.timestamp * 1000) : d?.timestamp
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
