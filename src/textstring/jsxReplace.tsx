import React, { ReactElement } from 'react';
import stringToRegex, { regexRegex } from '../utils/stringToRegex';
import generateUUID from '../functions/generateUid';

export type JsxReplacementFunction = ((params: { match: string, regexMatch?: RegExpMatchArray, variable: string | RegExp }) => string | ReactElement);
export type JsxReplacements = { [stringOrRegex: string]: ReactElement | string | JsxReplacementFunction };

export interface JsxReplaceConfig {
    text: string,
    replacements: JsxReplacements,
    maxReplacements?: number
    guid?: string,
    useDangerouslySetInnerHTML?: boolean
}

export default function jsxReplace(
    {
        text,
        replacements,
        maxReplacements = 20,
        guid = generateUUID(),
        useDangerouslySetInnerHTML = false
    }: JsxReplaceConfig
): Array<ReactElement | string> {
    const vars = Object.keys(replacements);
    let result: Array<string | ReactElement> = [text];
    // for every entry in "replacements"
    for (let i = 0; i < vars.length; i += 1) {
        // check whether the key is a regex
        const isRegexKey = regexRegex.test(vars[i]);
        const regex = stringToRegex(vars[i]);
        // for every match of the current replacement
        for (let j = 0;
             j < maxReplacements
             && result.find((m) =>
                 (typeof (m) === 'string' && (isRegexKey
                     ? regex.test(m)
                     : m.includes(vars[i])))
             );
             j++
        ) {
            // get the current index in the array to work with
            const arrayIdx = result.findIndex((m) =>
                (typeof (m) === 'string' && (isRegexKey
                    ? regex.test(m)
                    : m.includes(vars[i])))
            );
            // calculate data like the regex match if it's a regex or whether the replacement is a string or jsx
            let matchValue;
            let matchIndex: number;
            let matchLength;
            let fullMatch;
            let ReplaceElement = replacements[vars[i]];
            if (isRegexKey) {
                fullMatch = ((result[arrayIdx] as string).match(regex) as RegExpMatchArray);
                [matchValue] = fullMatch;
                matchIndex = fullMatch.index as number;
                matchLength = fullMatch[0].length;
            } else {
                matchValue = vars[i];
                matchLength = vars[i].length;
                matchIndex = (result[arrayIdx] as string).indexOf(vars[i]);
            }
            if (typeof replacements[vars[i]] === 'function') {
                ReplaceElement = (replacements[vars[i]] as JsxReplacementFunction)({
                    match: matchValue,
                    ...(isRegexKey ? { regexMatch: fullMatch } : {}),
                    variable: isRegexKey ? regex : vars[i]
                });
            }
            // declare the new result array
            const splitString = result[arrayIdx] as string;
            result = [
                ...result.slice(0, arrayIdx),
                ...(ReplaceElement && React.isValidElement(ReplaceElement)
                    ? [
                        // jsx replacement
                        splitString.substring(0, matchIndex),
                        React.cloneElement(ReplaceElement, { key: `${guid}:${i}.${j}` }),
                        splitString.substring(matchIndex + matchLength)
                    ] : [
                        // string replacement
                        `${splitString.substring(0, matchIndex)}${ReplaceElement}${
                            splitString.substring(matchIndex + matchLength)}`
                    ]),
                ...result.slice(arrayIdx + 1)
            ];
        }
    }
    if (useDangerouslySetInnerHTML) {
        for (let i = 0; i < result.length; i += 1) {
            if (typeof (result[i]) === 'string') {
                // eslint-disable-next-line react/no-danger
                result[i] = <span dangerouslySetInnerHTML={{ __html: (result[i] as string) }}/>;
            }
        }
    }
    return result;
}
