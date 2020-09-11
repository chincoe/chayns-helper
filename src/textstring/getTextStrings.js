import { TextString } from 'chayns-components';
import { isNullOrWhiteSpace } from 'chayns-components/lib/utils/is';
import types from '../functions/types';
import TEXTSTRING_PREFIX from './textstringPrefix';

/**
 * Get a list of textStrings
 * @param {string[]|Object.<string, string>} textStrings - format: [string_name1, string_name2]
 *     or { string_name1: fallback1, string_name2: fallback2 }
 * @param {string} language
 * @return {string[]}
 */
const getTextStrings = (textStrings, language = 'de') => {
    const returnList = [];
    const isSimple = !types.isObject(textStrings);
    const strings = isSimple ? textStrings : Object.keys(textStrings);
    for (let i = 0; i < strings.length; i += 1) {
        const current = strings[i];
        const fallback = isSimple ? current : textStrings[strings[i]];
        const text = TextString.getTextString(
            `${TEXTSTRING_PREFIX.value}${current}`,
            language,
            fallback
        );
        returnList.push(isNullOrWhiteSpace(text) ? fallback : text);
    }
    return returnList;
};

export default getTextStrings;
