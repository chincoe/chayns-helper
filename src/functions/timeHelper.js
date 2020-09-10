import { format } from 'date-fns';
import deLocale from 'date-fns/locale/de';

/**
 * Constant for time based on ms
 * @type {{hour: number, day: number, second: number, minute: number}}
 */
export const time = {
    second: 1000,
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24
};

/**
 * Format: [day]:[month], e.g. 12.3.
 * @param {Date} date
 * @return {string}
 */
export const getDaySimple = (date) => format(new Date(date), 'd.M.', { locale: deLocale });

/**
 * Format: [day]:[month], e.g. 12.3.
 * Append year if the year is not the current year, e.g. 12.3.2019
 * @param {Date} date
 * @return {string}
 */
export const getDate = (date) => `${getDaySimple(
    date
)}${date.getFullYear() === new Date().getFullYear() ? '' : date.getFullYear()}`;

/**
 * datefns format function, extended by the option to use "heute"|"morgen"|"gestern"
 * @param {Date|string|number} date
 * @param {string} formatString
 * @param {boolean} [useToday=false] - use "heute"|"morgen"|"gestern"
 * @return {string}
 *
 * @property {string} simpleMonth
 * @property {string} simpleMonth
 * @property {string} shortMonth
 * @property {string} longMonth
 * @property {string} day
 * @property {string} numberWeekDay
 * @property {string} shortWeekDay
 * @property {string} longWeekDay
 * @property {string} shortYear
 * @property {string} longYear
 * @property {string} hour
 * @property {string} simpleMinute
 * @property {string} minute
 *
 * @readonly
 */
export const fnsFormat = (date, formatString, useToday) => {
    const dateString = format(new Date(date), formatString, { locale: deLocale });
    if (!useToday) return dateString;
    const tFormatString = formatString
        .replace('H', '')
        .replace('h', '')
        .replace('A', '')
        .replace('a', '')
        .replace('s', '')
        .replace('S', '')
        .replace('m', '');
    return dateString
        .replace(format(new Date(), tFormatString, { locale: deLocale }), 'Heute')
        .replace(format(new Date(Date.now() + time.day), tFormatString, { locale: deLocale }), 'Morgen')
        .replace(format(new Date(Date.now() - time.day), tFormatString, { locale: deLocale }), 'Gestern');
};
fnsFormat.simpleMonth = 'M';
fnsFormat.shortMonth = 'MMM';
fnsFormat.longMonth = 'MMMM';
fnsFormat.day = 'D';
fnsFormat.numberWeekDay = 'd';
fnsFormat.shortWeekDay = 'ddd';
fnsFormat.longWeekDay = 'dddd';
fnsFormat.shortYear = 'YY';
fnsFormat.longYear = 'YYYY';
fnsFormat.hour = 'H';
fnsFormat.simpleMinute = 'm';
fnsFormat.minute = 'mm';
fnsFormat.second = 's';

/**
 * @type {{fnsFormat: (function((Date|string|number), string, boolean=): string), time: {hour: number, day: number,
 *     second: number, minute: number}}}
 */
const timeHelper = {
    time,
    fnsFormat
};

export default timeHelper;
