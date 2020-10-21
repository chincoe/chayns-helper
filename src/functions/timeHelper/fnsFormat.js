import { format } from 'date-fns/esm';
import deLocale from 'date-fns/esm/locale/de';
import time from '../../constants/time';

/**
 * datefns format function, extended by the option to use "heute"|"morgen"|"gestern". Using "yyyy?" will only display
 * the year if it is not the current year
 * @param {Date|string|number} date
 * @param {string} formatString
 * @param {boolean} [useToday=false] - use "heute"|"morgen"|"gestern"
 * @param {boolean} [appendYear=false] - append the year if it's not the current year
 * @return {string}
 *
 * @readonly
 */
const fnsFormat = (date, formatString, useToday, appendYear) => {
    let formatStr = formatString;
    const d = new Date(date);

    if (/y+\?/i.test(formatStr)) {
        if (d.getFullYear() !== new Date().getFullYear()) {
            formatStr = formatStr.replace(/(y+)\?/i, '$1');
        } else {
            formatStr = formatStr.replace(/ ?(y+)\?/i, '');
        }
    }

    let dateString = format(d, formatStr, { locale: deLocale });

    if (!useToday || Math.abs(d.getTime() - Date.now()) > time.day * 2) {
        if (appendYear) {
            if (appendYear && d.getFullYear() !== new Date().getFullYear()) {
                dateString += ` ${format(new Date(date), 'yyyy', { locale: deLocale })}`;
            }
        }
        return dateString;
    }

    const formatStringRegex = /^[^a-zA-Z]*?(([a-zA-Z]+[^a-zA-Z]? *)*)[^a-zA-Z]*?$/;
    const tFormatString = formatStr
        .replace(/'.*?'/g, '')
        .replace(/[EWGAaHhmsSZXx]/g, '')
        .replace(formatStringRegex, '$1')
        .trim();

    dateString = dateString
        .replace(format(new Date(), tFormatString, { locale: deLocale }), 'Heute')
        .replace(format(new Date(Date.now() + time.day), tFormatString, { locale: deLocale }), 'Morgen')
        .replace(format(new Date(Date.now() - time.day), tFormatString, { locale: deLocale }), 'Gestern');
    if (appendYear && !/(Heute)|(Morgen)|(Gestern)/.test(dateString)) {
        if (appendYear && d.getFullYear() !== new Date().getFullYear()) {
            dateString += ` ${format(new Date(date), 'yyyy', { locale: deLocale })}`;
        }
    }
    return dateString;
};

export default fnsFormat;
