import React, { useState, useEffect, SetStateAction, DOMElement } from 'react';

// capture group 1: tag name (e.g. "p")
const unclosedHtmlTagRegex = /<([a-zA-Z]{0,10}|(?:h[0-9]))(?: (?:(?: ?[a-zA-Z-]+=".*?")*))?>(?!.*?<\/\1>)/g;
const htmlOpeningTagRegexWithStyles = /<([a-zA-Z]{0,10}|(?:h[0-9]))(?: (?:(?: ?[a-zA-Z-]+=".*?")*))?>/;

// complete all opening tags with their respective closing tag while leaving styles intact
export const completeOpenTags = (str: string): string => {
    const matches = str.match(unclosedHtmlTagRegex);
    return matches ? `${str}${matches
        .reverse()
        .filter((m) => htmlOpeningTagRegexWithStyles.test(m))
        .map((m) => m.replace(htmlOpeningTagRegexWithStyles, '</$1>'))
        .join('')}` : str;
};

// this regex is so long because it needs to consider the tag being split anywhere, even in the middle of its attributes
// eslint-disable-next-line max-len
const splitHtmlTagRegex = /<\/?(?:(?:[a-zA-Z]{0,10}|(?:h[0-9]))(?:\s(?:\s*[a-zA-Z-]+(?:=(?:["'](?:[^"']+(?:["'])?)?)?)?)*)?\/?>?)?$/;
// removes html tags at the end of a html string section that were split to the point that they can no longer be
// interpreted as html
export const removeSplitTags = (stringPart: string): string => {
    if (splitHtmlTagRegex.test(stringPart)) {
        return stringPart.replace(splitHtmlTagRegex, '');
    }
    return stringPart;
};

// capture group 1: styles; capture group 2: content
const leadingParagraphTagRegex = /^<p((?: ?[a-zA-Z-]+=".*?")*)>((?:a|[^a])*)<\/p>/;
const paragraphTagRegex = /<p((?: ?[a-zA-Z-]+=".*?")*)>((?:a|[^a])*)<\/p>/g;
// replace <p>-tags with <br>-tags so the tag completion will not push the ellipsis ("mehr anzeigen") into the next line
// the <span>-tags are only there to retain all styles set on the <p>-tags
export const replaceParagraphTags = (str: string): string => str
    .replace(leadingParagraphTagRegex, '<span$1>$2</span>')
    .replace(paragraphTagRegex, '<br/><span$1>$2</span>')
    .replace('<br>', '<br/>');

// combine completeOpenTags and removeSplitTags and add the ellipsis for testing purposes
export function formatShortString(str: string, ellipsisLiteral = ''): string {
    const shortString = completeOpenTags(removeSplitTags(str));
    return `${shortString}${ellipsisLiteral}`;
}

export enum lineClampTypeEnum {
    HEIGHT = 'height',
    LINES = 'lines'
}

export const lineClampType = {
    HEIGHT: 'height',
    LINES: 'lines'
}

export interface ClampLinesConfig {
    /**
     * the string appended after the cut
     */
    ellipsis?: string,
    /**
     * whether the ellipsis should be added to the text or just factored  in for calculation
     */
    appendEllipsis?: boolean
    /**
     * limit type depends on options.type, either height in px or max lines goes here
     */
    limit?: number
    /**
     * type of the limit: 'lines' or 'height'
     */
    type?: 'lines'|'height'|typeof lineClampTypeEnum,
    /**
     * use html strings with innerHTML
     */
    html?: boolean
    /**
     * a function that receives the result string and returns a potentially modified result
     */
    replacer?: (value: string) => string
}

/**
 * Restrict the text to a specific height or line count, calculating and by default adding an ellipsis like "..." at
 * the end. Supports HTML-strings, but modifies those slightly to make the line breaks easier to line clamp.
 * @param input
 * @param options
 */
const useClampLines = (input: string, options?: ClampLinesConfig): [string, React.Dispatch<SetStateAction<any>>] => {
    const {
        ellipsis = '...',
        appendEllipsis = true,
        replacer,
        limit = 3,
        type = lineClampType.LINES,
        html = false
    } = (options || {});

    const [text, setText] = useState('');
    const [element, setElement] = useState<HTMLElement>();

    useEffect(() => {
        if (element) {
            const originalText = html ? replaceParagraphTags(input) : input;
            const prevHtml = element.innerHTML;
            let maxHeight = limit;
            element.innerHTML = '_';
            if (type === lineClampType.LINES) {
                maxHeight = element.getBoundingClientRect().height * limit;
            }
            if (maxHeight === 0 || maxHeight < element.getBoundingClientRect().height * limit) {
                setText('');
                // eslint-disable-next-line no-console
                console.warn('[useClampLines] Limit to small for 1 line');
                return;
            }
            let start = 0;
            let middle = 0;
            let end = originalText.length;

            while (start <= end) {
                middle = Math.floor((start + end) / 2);
                if (html) {
                    element.innerHTML = formatShortString(originalText.slice(0, middle), ellipsis);
                } else {
                    element.innerText = originalText.slice(0, middle) + ellipsis;
                }
                if (element?.getBoundingClientRect().height <= maxHeight
                    && middle === originalText.length + (ellipsis || '').length) {
                    setText(originalText);
                    return;
                }

                if (element.getBoundingClientRect().height <= maxHeight) {
                    start = middle + 1;
                } else {
                    end = middle - 1;
                }
            }
            let t = html
                    ? formatShortString(originalText.slice(0, middle - 2))
                    : originalText.slice(0, middle - 2) + (appendEllipsis ? ellipsis : '');
            if (replacer) {
                t = replacer(t);
            }
            element.innerHTML = prevHtml;
            setText(t);
        }
    }, [element, input, limit, type, replacer]);

    return [text, setElement];
};

export default useClampLines;
