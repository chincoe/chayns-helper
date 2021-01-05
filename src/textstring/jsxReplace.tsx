import React, {ReactElement} from 'react';
import stringToRegex, { regexRegex } from '../utils/stringToRegex';
import generateUUID from '../functions/generateUid';


export type JsxReplacements = {[stringOrRegex: string]: ReactElement|string|((params: {match: string, regex?: RegExp, variable: string}) => string|ReactElement)}

export interface JsxReplaceConfig {
    text: string,
    replacements: JsxReplacements,
    maxReplacements?: number
    guid?: string,
    useDangerouslySetInnerHTML?: boolean
}

/**
 * Replace parts in a text with JSX
 * @param text
 * @param replacements
 * @param maxReplacements
 * @param guid
 * @param useDangerouslySetInnerHTML
 */
export default function jsxReplace(
    {
        text,
        replacements,
        maxReplacements = 20,
        guid = generateUUID(),
        useDangerouslySetInnerHTML = false
    }: JsxReplaceConfig
): Array<ReactElement|string> {
    const vars = Object.keys(replacements);
    let result = [text];
    // for every entry in "replacements"
    for (let i = 0; i < vars.length; i += 1) {
        // check whether the key is a regex
        const isRegexKey = regexRegex.test(vars[i]);
        const regex = stringToRegex(vars[i]);
        // for every match of the current replacement
        for (let j = 0;
             j < maxReplacements
             && result.find((m) => (chayns.utils.isString(m) && (isRegexKey
                                                                 ? regex.test(m)
                                                                 : m.includes(vars[i]))));
             j++) {
            // get the current index in the array to work with
            const arrayIdx = result.findIndex((m) => (chayns.utils.isString(m) && (isRegexKey
                                                                                   ? regex.test(m)
                                                                                   : m.includes(vars[i]))));
            // calculate data like the regex match if it's a regex or whether the replacement is a string or jsx
            let matchValue;
            let matchIndex;
            let matchLength;
            const isReplacerFunction = chayns.utils.isFunction(replacements[vars[i]]);
            let ReplaceElement = replacements[vars[i]];
            if (isRegexKey) {
                const match = (result[arrayIdx].match(regex) as RegExpMatchArray);
                [matchValue] = match;
                matchIndex = match.index;
                matchLength = match[0].length;
            } else {
                matchValue = vars[i];
                matchLength = vars[i].length;
                matchIndex = result[arrayIdx].indexOf(vars[i]);
            }
            if (isReplacerFunction) {
                // @ts-expect-error
                ReplaceElement = replacements[vars[i]]({
                    match: matchValue,
                    ...(isRegexKey ? { regex } : {}),
                    variable: vars[i]
                });
            }
            // declare the new result array
            // @ts-expect-error
            result = [
                ...result.slice(0, arrayIdx),
                ...(ReplaceElement && React.isValidElement(ReplaceElement)
                    ? [
                        result[arrayIdx].substring(0, matchIndex),
                        React.cloneElement(ReplaceElement, { key: `${guid}:${i}.${j}` }),
                        // jsx replacement
                        // @ts-expect-error
                        result[arrayIdx].substring(matchIndex + matchLength)
                    ] : [
                        // string replacement
                        `${result[arrayIdx].substring(0, matchIndex)}${ReplaceElement}${result[arrayIdx].substring(
                            // @ts-expect-error
                            matchIndex + matchLength
                        )}`
                    ]),
                ...result.slice(arrayIdx + 1)
            ];
        }
    }
    if (useDangerouslySetInnerHTML) {
        for (let i = 0; i < result.length; i += 1) {
            if (chayns.utils.isString(result[i])) {
                // eslint-disable-next-line react/no-danger
                // @ts-expect-error
                result[i] = <span dangerouslySetInnerHTML={{ __html: result[i] }}/>;
            }
        }
    }
    return result;
}
