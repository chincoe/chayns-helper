import { TextString } from 'chayns-components';
import React, {
    memo, useMemo
} from 'react';
import PropTypes from 'prop-types';
import generateUUID from '../functions/generateUid';
import jsxReplace from './jsxReplace';
import TEXTSTRING_PREFIX from './textstringPrefix';

// memoized textstring component
// adds prefix automatically
// allows replacements based on regexes and (inline) function components:
// replacements: { [regexString]: (props) => <p>JSX</p> }
// or replacements: { [regexString]: string }
// retains all features including ctrl-click-to-change-textstring, html and language support
// WARNING: Nested JSX Replacements or nested replacements using setInnerHTML are not supported. Cannot replace
// anything inside a jsx replacement or anything wrapping a jsx replacement
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
 *
 * @property {function} jsxReplace
 *
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

    // get the string manually if it hasn't been passed by the chayns-components textstring component
    const calculatedString = TextString.getTextString(stringName) || fallback;
    const text = chayns.utils.isString(children)
                 ? children
                 : calculatedString;

    // generate a guid used for react keys
    const guid = useMemo(() => generateUUID(), []);

    // calculate the actual content with replacements. To display a mix of strings and react elements this function
    // creates an array of strings and react elements that is split further and further the more jsx replacements occur
    const content = useMemo(() => {
        jsxReplace({
            text,
            replacements,
            maxReplacements,
            useDangerouslySetInnerHTML,
            guid,
        });
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

TextStringMemo.jsxReplace = jsxReplace;

export default TextStringMemo;
