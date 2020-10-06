import { TextString } from 'chayns-components';
import React, {
    memo, useMemo
} from 'react';
import PropTypes from 'prop-types';
import stringToRegex, { regexRegex } from '../_internal/stringToRegex';
import generateUUID from '../functions/generateUid';
import useTextStrings from './useTextStrings';
import TEXTSTRING_PREFIX from './textstringPrefix';

// memoized textstring component
// adds prefix automatically
// allows replacements based on regexes and (inline) function components:
// replacements: { [regexString]: (props) => <p>JSX</p> }
// or replacements: { [regexString]: string }
// retains all features including ctrl-click-to-change-textstring, html and language support
/**
 * Memoized textstring Component
 * Allows replacements based on regex and inline function components.
 * replacements: { [regexString]: (props) => <p>JSX</p>} or { [regexString]: string }
 * retains all features including ctrl-click-to-change-textstring, html and language support
 * @param {Object} props
 * @param {string} props.stringName
 * @param {string} props.fallback
 * @param {Object.<string, string|function>} [props.replacements={}]
 * @param {string|*} [props.children]
 * @param {number} [props.maxReplacements=20] - Max. count of replacements per replacement item to avoid being stuck in
 *     an endless replacement loop
 * @param {boolean} [useDangerouslySetInnerHTML=false]
 * @param {string} [language='de']
 * @return {*}
 */
const TextStringMemo = memo((
    {
        stringName,
        fallback,
        replacements = {},
        children = null,
        maxReplacements = 20,
        useDangerouslySetInnerHTML = false,
        language = undefined,
        ...elementProps
    }
) => (
    <TextString
        stringName={`${TEXTSTRING_PREFIX.value}${stringName}`}
        fallback={fallback}
        useDangerouslySetInnerHTML={false}
        language={language}
    >
        <TextStringReplacer
            useDangerouslySetInnerHTML={useDangerouslySetInnerHTML}
            maxReplacements={maxReplacements}
            replacements={replacements}
            textStringChildren={children}
            stringName={stringName}
            fallback={fallback}
            {...elementProps}
        />
    </TextString>
));

TextStringMemo.propTypes = {
    useDangerouslySetInnerHTML: PropTypes.bool,
    language: PropTypes.string,
    maxReplacements: PropTypes.number,
    stringName: PropTypes.string.isRequired,
    fallback: PropTypes.string.isRequired,
    replacements: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.string])),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
};

TextStringMemo.defaultProps = {
    useDangerouslySetInnerHTML: false,
    language: undefined,
    maxReplacements: 20,
    replacements: {},
    children: null
};

TextStringMemo.displayName = 'TextStringMemo';

const TextStringReplacer = memo((props) => {
    const {
        children,
        textStringChildren,
        useDangerouslySetInnerHTML,
        replacements,
        maxReplacements,
        stringName,
        fallback,
        ...elementProps
    } = props;

    const [calculatedString] = useTextStrings(fallback ? { [stringName]: fallback } : [stringName]);

    const text = chayns.utils.isString(children)
                 ? children
                 : calculatedString;

    const content = useMemo(() => {
        const guid = generateUUID();
        const vars = Object.keys(replacements);
        let result = [text];
        for (let i = 0; i < vars.length; i += 1) {
            let j = 0;
            const isRegexKey = regexRegex.test(vars[i]);
            const regex = stringToRegex(vars[i]);
            while (j < maxReplacements && result.find((m) => (chayns.utils.isString(m) && (isRegexKey
                                                                                           ? regex.test(m)
                                                                                           : m.includes(vars[i]))))) {
                const arrayIdx = result.findIndex((m) => (chayns.utils.isString(m) && (isRegexKey
                                                                                       ? regex.test(m)
                                                                                       : m.includes(vars[i]))));
                let matchValue;
                let matchIndex;
                let matchLength;
                const isReplacerFunction = chayns.utils.isFunction(replacements[vars[i]]);
                const ReplaceElement = replacements[vars[i]];
                if (isRegexKey) {
                    const match = result[arrayIdx].match(regex);
                    [matchValue] = match;
                    matchIndex = match.index;
                    matchLength = match[0].length;
                } else {
                    matchValue = vars[i];
                    matchLength = vars[i].length;
                    matchIndex = result[arrayIdx].indexOf(vars[i]);
                }
                result = [
                    ...result.slice(0, arrayIdx),
                    ...(isReplacerFunction
                        ? [
                            result[arrayIdx].substring(0, matchIndex),
                            <ReplaceElement
                                var={vars[i]}
                                match={matchValue}
                                {...(isRegexKey ? { regex } : {})}
                                key={`${guid}:${i}.${j}`}
                            />,
                            result[arrayIdx].substring(matchIndex + matchLength)
                        ] : [
                            `${result[arrayIdx].substring(0, matchIndex)}${ReplaceElement}${result[arrayIdx].substring(
                                matchIndex + matchLength
                            )}`
                        ]),
                    ...result.slice(arrayIdx + 1)
                ];
                j += 1;
            }
        }
        if (useDangerouslySetInnerHTML) {
            for (let i = 0; i < result.length; i += 1) {
                if (chayns.utils.isString(result[i])) {
                    // eslint-disable-next-line react/no-danger
                    result[i] = <span dangerouslySetInnerHTML={{ __html: result[i] }}/>;
                }
            }
        }
        return result;
    }, [text, replacements]);

    return React.isValidElement(textStringChildren)
           ? React.cloneElement(textStringChildren, elementProps, content)
           : <>{content}</>;
});

TextStringReplacer.displayName = 'TextStringReplacer';

TextStringReplacer.propTypes = {
    useDangerouslySetInnerHTML: PropTypes.bool,
    language: PropTypes.string,
    maxReplacements: PropTypes.number,
    stringName: PropTypes.string.isRequired,
    fallback: PropTypes.string.isRequired,
    replacements: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.string])),
    children: PropTypes.string.isRequired,
    textStringChildren: PropTypes.element
};

TextStringReplacer.defaultProps = {
    useDangerouslySetInnerHTML: false,
    language: 'de',
    maxReplacements: 20,
    replacements: {},
    textStringChildren: null
};

export default memo(TextStringMemo);
