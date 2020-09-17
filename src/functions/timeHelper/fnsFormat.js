import { format } from 'date-fns';
import deLocale from 'date-fns/locale/de';
import time from '../../constants/time';

/**
 * datefns format function, extended by the option to use "heute"|"morgen"|"gestern"
 * @param {Date|string|number} date
 * @param {string} formatString
 * @param {boolean} [useToday=false] - use "heute"|"morgen"|"gestern"
 * @param {boolean} [appendYear=false] - append the year if it's not the current year
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
const fnsFormat = (date, formatString, useToday, appendYear) => {
    const d = new Date(date);
    let dateString = format(d, formatString, { locale: deLocale });
    if (appendYear
        && format(d, 'YYYY', { locale: deLocale })
        !== format(new Date(), 'YYYY', { locale: deLocale })
    ) {
        dateString += ` ${format(new Date(date), 'YYYY', { locale: deLocale })}`;
    }
    if (!useToday || Math.abs(d.getTime() - Date.now()) > time.day * 2) return dateString;
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

export default fnsFormat;
