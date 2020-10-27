import { useState, useEffect } from 'react';

/**
 * Restricts text to a specific height and ends it with a certain ellipsis.
 * If you want to use a specific line count, use the react-clamp-lines package.
 *
 * @param {string} originalText
 * @param {Object} options
 * @param {string} [options.ellipsis]
 * @param {number} [options.maxHeight]
 * @param {function(string) : string} [options.replacer]
 * @returns {[string, function(*), number]}
 */
const useClampLines = (originalText, options) => {
    const {
        ellipsis = '...',
        replacer,
        maxHeight
    } = (options || {});

    const [text, setText] = useState('');
    const [element, setElement] = useState();

    useEffect(() => {
        if (element) {
            let start = 0;
            let middle = 0;
            let end = originalText.length;

            while (start <= end) {
                middle = Math.floor((start + end) / 2);
                element.innerText = originalText.slice(0, middle);
                if (middle === originalText.length) {
                    setText(originalText);
                    return;
                }

                if (element.clientHeight <= maxHeight) {
                    start = middle + 1;
                } else {
                    end = middle - 1;
                }
            }
            let t = originalText.slice(0, middle - 5) + ellipsis;
            if (replacer) {
                t = replacer(t);
            }
            // element.innerText = t;
            element.innerText = t;
            setText(t);
        }
    }, [text, element, originalText, maxHeight, replacer]);

    return [text, setElement];
};

export default useClampLines;
