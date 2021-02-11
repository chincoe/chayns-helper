import { useMemo } from 'react';
import getTextStrings from './getTextStrings';

/**
 * Hook to get a list of textStrings
 */
const useTextStrings = (stringObject: string[] | { [name: string]: string }, language = 'de') => useMemo(
    () => getTextStrings(stringObject, language), [stringObject]
);

export default useTextStrings;
