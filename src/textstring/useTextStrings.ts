import { useMemo } from 'react';
import getTextStrings from './getTextStrings';

// function overloads for different input types

/**
 * Get a memoized array of textStrings
 * @param textStrings
 * @param language
 */
function useTextStrings(
    textStrings: string[],
    language?: string
): Array<string> & Record<string, string>;
/**
 * Get multiple memoized textStrings with fallbacks
 * @param textStrings
 * @param language
 */
function useTextStrings<T extends Record<string, string>>(
    textStrings: T,
    language?: string
): Array<string> & Record<keyof T, string>;

/**
 * Hook to get a list of textStrings
 * @param stringObject
 * @param language
 */
function useTextStrings(
    stringObject: unknown,
    language?: string,
): unknown {
    return useMemo(() => getTextStrings(stringObject as never, language), [stringObject, language]);
}

export default useTextStrings;
