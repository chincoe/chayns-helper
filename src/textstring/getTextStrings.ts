// @ts-expect-error
import { TextString } from 'chayns-components';
import isNullOrWhiteSpace from '../utils/isNullOrWhiteSpace';
import TEXTSTRING_CONFIG from './textstringConfig';

/**
 * Get a list of textStrings
 * @param textStrings - format: [string_name1, string_name2] or { string_name1: fallback1, string_name2: fallback2 }
 * @param language
 */
const getTextStrings = (textStrings: string[]|{[name: string]: string}, language = 'de'): Array<string> => {
    const returnList = [];
    const isSimple = !chayns.utils.isObject(textStrings);
    const strings: string[] = <string[]>(isSimple ? textStrings : Object.keys(textStrings));
    for (let i = 0; i < strings.length; i += 1) {
        const current = strings[i];
        // @ts-expect-error
        const fallback = (isSimple ? current : textStrings[strings[i]]);
        const text = TextString.getTextString(
            `${TEXTSTRING_CONFIG.prefix}${current}`,
            language,
            fallback
        );
        returnList.push(isNullOrWhiteSpace(text) ? fallback : text);
    }
    return returnList;
};

export default getTextStrings;
