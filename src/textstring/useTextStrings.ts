import { useMemo } from 'react';
import getTextStrings from './getTextStrings';

/**
 * Hook to get a list of textStrings
 */
const useTextStrings = (stringObject: string[] | { [name: string]: string }, language = 'de'): string[] => useMemo(
    () => getTextStrings(stringObject, language), [stringObject, language]
);

export default useTextStrings;
