import { format } from 'date-fns/esm';
import deLocale from 'date-fns/esm/locale/de';
import time from '../../constants/time';

/**
 * datefns format function, extended by the option to use "heute"|"morgen"|"gestern". Using "yyyy?" will only display
 * the year if it is not the current year
 * @param {Date|string|number} date
 * @param {string} formatString
 * @param {Object} [options]
 * @param {boolean} [options.useToday=false] - use "heute"|"morgen"|"gestern"
 * @param {boolean} [options.appendYear=false] - append the year if it's not the current year
 * @param {Locale} [options.locale=deLocale] - date-fns locale
 * @return {string}
 *
 * @readonly
 */
const fnsFormat = (date, formatString, options) => {
    const {
        useToday,
        appendYear,
        locale
    } = (options || {});
    let formatStr = formatString;
    const d = new Date(date);

    if (/y+\?/i.test(formatStr)) {
        if (d.getFullYear() !== new Date().getFullYear()) {
            formatStr = formatStr.replace(/(y+)\?/i, '$1');
        } else {
            formatStr = formatStr.replace(/ ?(y+)\?/i, '');
        }
    }

    let dateString = format(d, formatStr, { locale: (locale || deLocale) });

    if (!useToday || Math.abs(d.getTime() - Date.now()) > time.day * 2) {
        if (appendYear) {
            if (appendYear && d.getFullYear() !== new Date().getFullYear()) {
                dateString += ` ${format(new Date(date), 'yyyy', { locale: (locale || deLocale) })}`;
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
        .replace(format(new Date(), tFormatString, { locale: (locale || deLocale) }), 'Heute')
        .replace(format(new Date(Date.now() + time.day), tFormatString, { locale: (locale || deLocale) }), 'Morgen')
        .replace(format(new Date(Date.now() - time.day), tFormatString, { locale: (locale || deLocale) }), 'Gestern');
    if (appendYear && !/(Heute)|(Morgen)|(Gestern)/.test(dateString)) {
        if (appendYear && d.getFullYear() !== new Date().getFullYear()) {
            dateString += ` ${format(new Date(date), 'yyyy', { locale: (locale || deLocale) })}`;
        }
    }
    return dateString;
};

export default fnsFormat;
