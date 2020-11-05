import { useMemo } from 'react';
import getTextStrings from './getTextStrings';

/**
 * Hook to get a list of textStrings
 * @param {string[]|Object<string, string>} stringObject - format: [string_name1, string_name2]
 *     or { string_name1: fallback1, string_name2: fallback2 }
 * @param {string} language
 * @return {string[]}
 */
const useTextStrings = (stringObject, language = 'de') => useMemo(
    () => getTextStrings(stringObject, language), [stringObject]
);

export default useTextStrings;
