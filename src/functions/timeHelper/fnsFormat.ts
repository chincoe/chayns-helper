import { format } from 'date-fns/esm';
// @ts-expect-error
import { TextString } from 'chayns-components';
import { de, enUS, es, fr, it, nl, pt, tr } from 'date-fns/esm/locale';
import time from '../../constants/time';

declare type LangOptions = {
    locale: Locale,
    yesterday: string,
    today: string,
    tomorrow: string,
    at: string
}

const languages: Record<string, LangOptions> = {
    de: {
        locale: de,
        yesterday: 'Gestern',
        today: 'Heute',
        tomorrow: 'Morgen',
        at: 'um'
    },
    en: {
        locale: enUS,
        yesterday: 'Yesterday',
        today: 'Today',
        tomorrow: 'Tomorrow',
        at: 'at'
    },
    nl: {
        locale: nl,
        yesterday: 'Gisteren',
        today: 'Vandaag',
        tomorrow: 'Morgen',
        at: 'om'
    },
    it: {
        locale: it,
        yesterday: 'Ieri',
        today: 'Oggi',
        tomorrow: 'Domani',
        at: 'alle'
    },
    fr: {
        locale: fr,
        yesterday: 'Hier',
        today: 'Aujourd’hui',
        tomorrow: 'Demain',
        at: 'à'
    },
    pt: {
        locale: pt,
        yesterday: 'Ontem',
        today: 'Hoje',
        tomorrow: 'Amanhã',
        at: 'à'
    },
    es: {
        locale: es,
        yesterday: 'Ayer',
        today: 'Hoy',
        tomorrow: 'Mañana',
        at: 'a la'
    },
    tr: {
        locale: tr,
        yesterday: 'Dün',
        today: 'Bugün',
        tomorrow: 'Yarın',
        at: 'saat'
    }
}

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
    locale?: Locale,
    language?: string | 'de' | 'en' | 'nl' | 'it' | 'fr' | 'pt' | 'es' | 'tr'
}): string => {
    const {
        useToday,
        appendYear
    } = (options || {});

    const language = options?.language || TextString.language || 'de';
    const langOptions = languages[language] || languages.de;
    const locale = options?.locale || langOptions.locale

    let formatStr = formatString
        .replace(/(?:^| )#at# /g, ` '${langOptions.at}' `);
    const d = new Date(date);

    if (/y+\?/i.test(formatStr)) {
        if (d.getFullYear() !== new Date().getFullYear()) {
            formatStr = formatStr.replace(/(y+)\?/i, '$1');
        } else {
            formatStr = formatStr.replace(/ ?(y+)\?/i, '');
        }
    }

    let dateString = format(d, formatStr, { locale });

    if (!useToday || Math.abs(d.getTime() - Date.now()) > time.day * 2) {
        if (appendYear) {
            if (appendYear && d.getFullYear() !== new Date().getFullYear()) {
                dateString += ` ${format(new Date(date), 'yyyy', { locale })}`;
            }
        }
        return dateString;
    }

    const formatStringRegex = /^[^a-zA-Z]*?(([a-zA-Z]+[^a-zA-Z]? *)*)[^a-zA-Z]*?$/;
    const tFormatString = formatStr
        .replace(/'.*?'/g, '')
        .replace(/[EWGAaHhmsSZXxpbPBOtTKo]|(?:'.*?')/g, '')
        .replace(formatStringRegex, '$1')
        .trim();

    dateString = dateString
        .replace(format(new Date(), tFormatString, { locale }), langOptions.today)
        .replace(format(new Date(Date.now() + time.day), tFormatString, { locale }), langOptions.tomorrow)
        .replace(format(new Date(Date.now() - time.day), tFormatString, { locale }), langOptions.yesterday);
    if (appendYear &&
        !new RegExp(`/(${langOptions.today})|(${langOptions.tomorrow})|(${langOptions.yesterday})/`).test(dateString)
        && d.getFullYear() !== new Date().getFullYear()
    ) {
        dateString += ` ${format(new Date(date), 'yyyy', { locale })}`;
    }
    return dateString;
};

export default fnsFormat;
