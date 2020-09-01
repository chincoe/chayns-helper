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
 * Remove the timezone offset of dates that are falsely declared as UTC despite being a local date
 * @param {Date} date
 * @return {Date}
 */
export const removeTimeZoneOffset = (date) => new Date(
    new Date(date).getTime() - new Date().getTimezoneOffset() * time.minute
);

/**
 * Format: HH:mm
 * @param {Date} pDate
 * @return {string}
 */
export const simpleTimeFormat = (pDate) => {
    const date = new Date(pDate);
    return `${date.getHours()}:${`00${date.getMinutes()}`.slice(-2)}`;
};

/**
 * Format: [day]:[month], e.g. 12.3.
 * @param {Date} date
 * @return {string}
 */
const getDaySimple = (date) => format(new Date(date), 'd.M.', { locale: deLocale });

/**
 * Format: [day]:[month], e.g. 12.3.
 * Append year if the year is not the current year, e.g. 12.3.2019
 * @param {Date} date
 * @return {string}
 */
const getDate = (date) => `${getDaySimple(
    date
)}${date.getFullYear() === new Date().getFullYear() ? '' : date.getFullYear()}`;

/**
 * Format: [day]:[monthAsText], e.g. 12.Jan.
 * @param {Date} date
 * @return {string}
 */
const getDayLong = (date) => format(new Date(date), 'dd. MMM.', { locale: deLocale });

// gestern um 13:40 Uhr
// am 12.3. um 13:40 Uhr
// am 12.3.2019 um 13:40 Uhr
/**
 * Format: [gestern|heute|morgen|am 12.3.|am 12.3.2019] um HH:mm Uhr
 * @param pDate
 * @return {string}
 */
export const formatDateText = (pDate) => {
    const date = new Date(pDate);
    let day = `am ${getDate(date)}`;
    if (date.getFullYear() === new Date().getFullYear()) {
        if (getDate(date) === getDate(new Date())) {
            day = 'heute';
        } else if (getDate(date) === getDate(new Date(Date.now() - (time.day)))) {
            day = 'gestern';
        } else if (getDate(date) === getDate(new Date(Date.now() + (time.day)))) {
            day = 'morgen';
        }
    }
    return `${day} um ${format(date, 'HH:mm', { locale: deLocale })} Uhr`;
};

// Heute, 13:40 Uhr
// 12.3., 13:40 Uhr
// 12.3.2019, 13:40 Uhr
/**
 * Format: [Gestern|Heute|Morgen|12.3.|12.3.2019], HH:mm Uhr
 * @param {Date} pDate
 * @param {boolean} useLongMonth - month as 12.1. or 12.Jan.
 * @return {string}
 */
export const formatDate = (pDate, useLongMonth = false) => {
    const gDay = useLongMonth ? getDayLong : getDaySimple;

    const date = new Date(pDate);
    let day = `${gDay(date)}${date.getFullYear() !== new Date().getFullYear() ? ` ${date.getFullYear()}` : ''}`;
    if (date.getFullYear() === new Date().getFullYear()) {
        if (gDay(date) === gDay(new Date())) {
            day = 'Heute';
        } else if (gDay(date) === gDay(new Date(Date.now() - (time.day)))) {
            day = 'Gestern';
        } else if (gDay(date) === gDay(new Date(Date.now() + (time.day)))) {
            day = 'Morgen';
        }
    }

    return `${day}, ${format(date, 'HH:mm', { locale: deLocale })} Uhr`;
};

/**
 * datefns format function, extended by the option to use "heute"|"morgen"|"gestern"
 * @param {Date|string|number} date
 * @param {string} formatString
 * @param {boolean} useToday - use "heute"|"morgen"|"gestern"
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
export const fnsFormat = (date, formatString, useToday = false) => {
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
