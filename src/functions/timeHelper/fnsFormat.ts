import { format } from 'date-fns/esm';
import { TextString } from 'chayns-components';
import de from 'date-fns/esm/locale/de';
import enUS from 'date-fns/esm/locale/en-US';
import es from 'date-fns/esm/locale/es';
import fr from 'date-fns/esm/locale/fr';
import it from 'date-fns/esm/locale/it';
import nl from 'date-fns/esm/locale/nl';
import pt from 'date-fns/esm/locale/pt';
import tr from 'date-fns/esm/locale/tr';
import pl from 'date-fns/esm/locale/pl';
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
    },
    pl: {
        locale: pl,
        yesterday: 'Wczoraj',
        today: 'Dziś',
        tomorrow: 'Jutro',
        at: 'o'
    }
};

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
    language?: string | 'de' | 'en' | 'nl' | 'it' | 'fr' | 'pt' | 'es' | 'tr' | 'pl'
}): string => {
    const {
        useToday,
        appendYear
    } = (options || {});

    const language = options?.language || TextString.language || 'de';
    const langOptions = languages[language] || languages.de;
    const locale = options?.locale || langOptions.locale;

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
    if (language === 'de') {
        formatStr = formatStr.replace(/^([^']*(?:[^']*'[^']*'[^']*)*)p/g, '$1HH:mm \'Uhr\'');
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
        .replace(/[EWGAaHhmsSZXxpbPBOtTKo]|'.*?'/g, '')
        .replace(formatStringRegex, '$1')
        .trim();

    dateString = dateString
        .replace(format(new Date(), tFormatString, { locale }), langOptions.today)
        .replace(format(new Date(Date.now() + time.day), tFormatString, { locale }), langOptions.tomorrow)
        .replace(format(new Date(Date.now() - time.day), tFormatString, { locale }), langOptions.yesterday);
    if (appendYear
        && !new RegExp(`/(${langOptions.today})|(${langOptions.tomorrow})|(${langOptions.yesterday})/`).test(dateString)
        && d.getFullYear() !== new Date().getFullYear()
    ) {
        dateString += ` ${format(new Date(date), 'yyyy', { locale })}`;
    }
    return dateString;
};

export default fnsFormat;
