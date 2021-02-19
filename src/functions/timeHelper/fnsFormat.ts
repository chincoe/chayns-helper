import { format } from 'date-fns/esm';
import deLocale from 'date-fns/esm/locale/de';
import time from '../../constants/time';

/**
 * date-fns format() function extended with the feature to work with date strings and timestamps, the feature to use
 * "heute", "morgen" or "gestern" and the feature to append the year if it differs from the current one
 * @param date
 * @param formatString
 * @param options
 */
const fnsFormat = (date: Date | string | number, formatString: string, options?: {
    useToday?: boolean,
    appendYear?: boolean,
    locale?: Locale
}): string => {
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
        .replace(/[EWGAaHhmsSZXx]|(?:'.*?')/g, '')
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
