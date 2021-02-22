// @ts-expect-error
import { TextString } from 'chayns-components';
import isNullOrWhiteSpace from '../utils/isNullOrWhiteSpace';
import TEXTSTRING_CONFIG from './textstringConfig';

// function overloads for different input types

/**
 * Get a single textString
 * @param textString
 * @param fallback
 * @param language
 */
function getTextStrings(
    textString: string,
    fallback: string,
    language?: string
): string;
/**
 * Get an array of textStrings
 * @param textStrings
 * @param language
 */
function getTextStrings(
    textStrings: string[],
    language?: string
): Array<string> & Record<string, string>;
/**
 * Get multiple textStrings with fallbacks
 * @param textStrings
 * @param language
 */
function getTextStrings<T extends Record<string, string>>(
    textStrings: T,
    language?: string
): Array<string> & Record<keyof T, string>;

/**
 * Get a list of textStrings
 * @param textStrings
 * @param fallbackOrLanguage
 * @param language
 */
function getTextStrings(
    textStrings: string | string[] | Record<string, string>,
    fallbackOrLanguage?: string,
    language?: string
): string | Array<string> & Record<string, string> {
    const returnList = [];
    const isObject = Object.prototype.toString.call(textStrings) === "[object Object]";
    const isArray = Object.prototype.toString.call(textStrings) === "[object Array]";
    const strings: string[] = <string[]>(isArray
        ? textStrings
        : isObject
            ? Object.keys(textStrings)
            : [textStrings]);
    for (let i = 0; i < strings.length; i += 1) {
        const current = strings[i];
        const fallback = (!isObject
            ? isArray
                ? undefined
                : fallbackOrLanguage
            : (<Record<string, string>>textStrings)[strings[i]]);
        const text: string = TextString.getTextString(
            `${TEXTSTRING_CONFIG.prefix}${current}`,
            !isObject && !isArray
                ? language
                : fallbackOrLanguage,
            fallback
        );
        returnList.push(isNullOrWhiteSpace(text) ? fallback : text);
        // @ts-expect-error
        returnList[current] = isNullOrWhiteSpace(text) ? fallback : text
    }
    return !isArray && !isObject ? <string>returnList[0] : <Array<string> & Record<string, string>>returnList;
}

export default getTextStrings;
