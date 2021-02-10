import React, { ReactElement } from 'react';
import parse from 'html-react-parser';
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

// eslint-disable-next-line max-len
const jsxPlaceholderRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-4][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}_([0-9]+)$/;

/**
 * A helper to replace parts of a string with react components. Returns a mixed array of strings and react components
 * that can be rendered. Consult TextString.md for usage.
 * @param text - the original text
 * @param replacements - the replacements
 * @param maxReplacements - maximum amount of iterations per replacement, default: 20
 * @param guid - guid used to generate react list keys, default: new GUID
 * @param useDangerouslySetInnerHTML - interpret left over strings as HTML by wrapping them in spans with
 *     dangerouslyInnerHtml
 */
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
    let result: Array<ReactElement | string> = [text];
    const jsxReplacements: Array<ReactElement> = [];
    // for every entry in "replacements"
    for (let i = 0; i < vars.length; i += 1) {
        // check whether the key is a regex
        const isRegexKey = regexRegex.test(vars[i]);
        const regex = stringToRegex(vars[i]);
        // for every match of the current replacement
        for (let j = 0;
             j < maxReplacements && result.find((m) =>
                 (typeof (m) === 'string' && (isRegexKey
                     ? regex.test(m)
                     : m.includes(vars[i]))));
             j++
        ) {
            // get the current index in the array to work with
            const arrayIdx = result.findIndex((m) =>
                (typeof (m) === 'string' && (isRegexKey
                    ? regex.test(m)
                    : m.includes(vars[i]))));
            // calculate data like the regex match if it's a regex or whether the replacement is a string or jsx
            let matchValue;
            let matchIndex;
            let matchLength;
            let fullMatch;
            let ReplaceElement = replacements[vars[i]];
            if (isRegexKey) {
                fullMatch = (result[arrayIdx] as string).match(regex) as RegExpMatchArray;
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
            if (typeof ReplaceElement === 'string') {
                result[arrayIdx] = (result[arrayIdx] as string).replace(isRegexKey ? regex : vars[i], ReplaceElement);
            } else {
                if (useDangerouslySetInnerHTML && React.isValidElement(ReplaceElement)) {
                    jsxReplacements.push(React.cloneElement(ReplaceElement, { key: `${guid}:${i}.${j}` }));
                }
                // declare the new result array
                const splitString = result[arrayIdx] as string;
                result = [
                    ...result.slice(0, arrayIdx),
                    ...(ReplaceElement && React.isValidElement(ReplaceElement)
                        ? [
                            // jsx replacement
                            splitString.substring(0, matchIndex),
                            useDangerouslySetInnerHTML
                                ? `<span id="${guid}_${jsxReplacements.length - 1}"/>`
                                : React.cloneElement(ReplaceElement, { key: `${guid}:${i}.${j}` }),
                            splitString.substring(matchIndex + matchLength)
                        ] : [
                            // fallback replacement
                            `${splitString.substring(0, matchIndex)}${ReplaceElement}${
                                splitString.substring(matchIndex + matchLength)}`
                        ]),
                    ...result.slice(arrayIdx + 1)
                ];
            }
        }
    }
    if (useDangerouslySetInnerHTML) {
        const htmlString = result.join('');
        return parse(htmlString, {
            // @ts-expect-error
            replace: (domNode) => {
                if (domNode.type === 'tag' && (domNode as { name: string }).name === 'span') {
                    const attribute = (domNode as { attributes: { name: string, value: string }[] })
                        .attributes.find((a) => a.name === 'id'
                                                && jsxPlaceholderRegex.test(a.value)
                        );
                    if (attribute) {
                        const index = (attribute.value.match(jsxPlaceholderRegex) as RegExpMatchArray)[1];
                        return jsxReplacements[+index];
                    }
                }
            }
        }) as Array<ReactElement | string>;
    }
    return result;
}
