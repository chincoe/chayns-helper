

// @ts-ignore
import { TextString } from 'chayns-components';
import React, {
    FunctionComponent,
    memo, ReactChildren, useMemo
} from 'react';
import generateUUID from '../functions/generateUid';
import jsxReplace, {JsxReplacements} from './jsxReplace';
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

export interface TextStringMemoConfig {
    stringName: string,
    fallback: string,
    replacements: JsxReplacements,
    children?: React.ReactChildren|null,
    maxReplacements?: number,
    useDangerouslySetInnerHTML?: boolean,
    language?: string
}

const TextStringMemo: FunctionComponent<TextStringMemoConfig> = memo((
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
        {/* @ts-ignore */}
        <TextStringReplacer
            // @ts-ignore
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

TextStringMemo.displayName = 'TextStringMemo';

interface TextStringReplacerConfig {
    children: string|ReactChildren,
    textStringChildren?: ReactChildren|null,
    replacements: JsxReplacements,
    useDangerouslySetInnerHTML?: boolean,
    maxReplacements?: number,
    stringName: string,
    fallback: string

}

const TextStringReplacer: FunctionComponent<TextStringReplacerConfig> = memo((props) => {
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
        // @ts-ignore
        ? React.cloneElement(textStringChildren, elementProps, content)
           : <>{content}</>;
});

TextStringReplacer.displayName = 'TextStringReplacer';

export default TextStringMemo;
