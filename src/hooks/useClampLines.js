import { useState, useEffect } from 'react';

// complete all tags with
export const completeOpenTags = (str) => {
    const matches = str.match(/<([a-zA-Z]{0,10}|(h[0-9]))>(?!<\1>)/);
    return matches ? `${str}${matches.reverse()
        .join('')}` : str;
};

// removes html tags at the end of a html string section that were split to the point that they can no longer be
// interpreted as html
export const removeSplitTags = (stringPart) => {
    if (/<([a-zA-Z]{0,10}|(h[0-9])>?)?$/.test(stringPart)) {
        return stringPart.replace(/<([a-zA-Z]{0,10}|(h[0-9])>?)?$/, '');
    }
    return stringPart;
};

// replace <p>-tags with <br>-tags so the tag completion will not push the ellipsis ("mehr anzeigen") into the next line
export const removeParagraphTags = (str) => str
    .replace(/^<p>((a|[^a])*)<\/p>/, '$1')
    .replace(/<p>((a|[^a])*)<\/p>/g, '<br/>$1');

// combine completeOpenTags and removeSplitTags and add the ellipsis for testing purposes
export function formatShortString(str, ellipsisLiteral = '') {
    const shortString = completeOpenTags(removeSplitTags(str));
    return `${shortString}${ellipsisLiteral}`;
}

export const lineClampType = {
    HEIGHT: 'height',
    LINES: 'lines'
};

/**
 * Restricts text to a specific height and ends it with a certain ellipsis.
 * If you want to use a specific line count, use the react-clamp-lines package.
 *
 * @param {string} originalText
 * @param {Object} [options]
 * @param {string} [options.ellipsis] - the string used to cut
 * @param {boolean} [options.appendEllipsis=true] - whether the ellipsis should be added to the text or just factored
 *     in for calculation
 * @param {number} [options.limit] - limit type depends on options.type, either height in px or max lines goes here
 * @param {boolean} [options.type='lines'] - height or lines
 * @param {boolean} [options.html=false] - use html strings with innerHTML
 * @param {function(string) : string} [options.replacer]
 * @returns {[string, function(*), number]}
 */
const useClampLines = (originalText, options) => {
    const {
        ellipsis = '...',
        appendEllipsis = true,
        replacer,
        limit = 3,
        type = lineClampType.LINES,
        html = false
    } = (options || {});

    const [text, setText] = useState('');
    const [element, setElement] = useState();

    useEffect(() => {
        if (element) {
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
    }, [element, originalText, limit, type, replacer]);

    return [text, setElement];
};

export default useClampLines;
