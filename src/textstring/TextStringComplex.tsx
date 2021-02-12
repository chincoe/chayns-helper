import React, { FunctionComponent, memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';
// @ts-expect-error
import { TextString } from 'chayns-components';
// @ts-expect-error
import isTobitEmployee from 'chayns-components/dist/esm/utils/tobitEmployee.js';
import generateUUID from '../functions/generateUid';
import jsxReplace, { JsxReplacements } from './jsxReplace';
import TEXTSTRING_CONFIG from './textstringConfig';
import isNullOrWhiteSpace from '../utils/isNullOrWhiteSpace';

export interface TextStringComplexConfig {
    stringName: string;
    fallback: string;
    replacements?: JsxReplacements;
    children?: React.ReactNode | null;
    maxReplacements?: number;
    useDangerouslySetInnerHTML?: boolean;
    language?: string;
    autoCreation?: boolean;
}

/**
 * An improved version of chayns-components TextString that features automatic prefixing, jsx replacements and
 * automatic text string creation for missing texts. Consult TextString.md for usage
 * @param stringName - the string name without prefix
 * @param fallback - a required fallback
 * @param replacements - replacements
 * @param children - the child node the text should be rendered into
 * @param maxReplacements - maximum iterations per replacement, default: 20
 * @param useDangerouslySetInnerHTML
 * @param language
 * @param autoCreation - turn auto creation for missing texts on/off
 * @param props
 * @constructor
 */
const TextStringComplex: FunctionComponent<TextStringComplexConfig> = ({
    stringName,
    fallback,
    replacements = {},
    children = null,
    maxReplacements = 20,
    useDangerouslySetInnerHTML = false,
    language = undefined,
    autoCreation = process.env.NODE_ENV === 'production',
    ...props
}) => {
    // create missing textStrings in QA/Production if opened by an authorized developer
    useEffect(() => {
        (async () => {
            try {
                if (autoCreation
                    && !isNullOrWhiteSpace(fallback)
                    && !isNullOrWhiteSpace(stringName)
                    && (TextString.getTextString(stringName) ?? null) === null
                    && !isNullOrWhiteSpace(TEXTSTRING_CONFIG.libName)
                    && !isNullOrWhiteSpace(TEXTSTRING_CONFIG.prefix)
                    && chayns.env.user.isAuthenticated
                ) {
                    isTobitEmployee().then(async () => {
                        const libResponse = await fetch(
                            `https://webapi.tobit.com/TextStringService/v1.0/V2/LangLibs/${TEXTSTRING_CONFIG.libName}`,
                            {
                                method: 'GET',
                                cache: 'no-cache',
                                headers: new Headers({
                                    Authorization: `Bearer ${chayns.env.user.tobitAccessToken}`
                                })
                            }
                        );
                        const libContent = await libResponse.json();
                        if (libResponse.status === 200 && libContent && Array.isArray(libContent)
                            && !libContent.find(s => s.stringName === `${TEXTSTRING_CONFIG.prefix}${stringName}`)) {
                            const response = await fetch(
                                `https://webapi.tobit.com/TextStringService/v1.0/V2/LangStrings?libName=${TEXTSTRING_CONFIG.libName}`,
                                {
                                    method: 'PUT',
                                    headers: new Headers({
                                        Authorization: `Bearer ${chayns.env.user.tobitAccessToken}`,
                                        'Content-Type': 'application/json'
                                    }),
                                    body: JSON.stringify({
                                        description: '',
                                        stringName: `${TEXTSTRING_CONFIG.prefix}${stringName}`,
                                        textEng: '',
                                        textFra: '',
                                        textGer: fallback,
                                        textIt: '',
                                        textNl: '',
                                        textES: '',
                                        textPT: '',
                                        textTR: '',
                                        toTranslate: ['en', 'nl', 'it', 'fr', 'pt', 'es', 'tr']
                                    })
                                }
                            );
                            if (response && response.status === 201) {
                                console.warn(
                                    `[TextString] Created string '${TEXTSTRING_CONFIG.prefix}${stringName}' as '${fallback}'. Translated to: ${[
                                        'en',
                                        'nl',
                                        'it',
                                        'fr',
                                        'pt',
                                        'es',
                                        'tr'
                                    ].join(', ')}.`
                                );
                            }
                        }
                    });
                }
            } catch (e) {
                // ignored
            }
        })();
    }, []);
    return (
        <TextString
            stringName={`${TEXTSTRING_CONFIG.prefix}${stringName}`}
            fallback={fallback}
            useDangerouslySetInnerHTML={false}
            language={language}
        >
            {
                /* @ts-expect-error */
                <TextStringReplacer
                    dangerouslySetInnerHTML={useDangerouslySetInnerHTML}
                    maxReplacements={maxReplacements}
                    replacements={replacements}
                    textStringChildren={children}
                    stringName={stringName}
                    fallback={fallback}
                    {...props}
                />
            }
        </TextString>
    );
};

interface TextStringReplacerConfig {
    children: string | ReactNode;
    textStringChildren?: ReactNode | null;
    replacements: JsxReplacements;
    dangerouslySetInnerHTML?: boolean;
    maxReplacements?: number;
    stringName: string;
    fallback: string;

}

const TextStringReplacer: FunctionComponent<TextStringReplacerConfig> = ({
    children,
    textStringChildren,
    dangerouslySetInnerHTML,
    replacements,
    maxReplacements,
    stringName,
    fallback,
    ...elementProps
}) => {
    // get the string manually if it hasn't been passed by the chayns-components textstring component
    const calculatedString = TextString.getTextString(stringName) || fallback;
    const text = typeof (children) === 'string'
        ? children
        : calculatedString;

    // generate a guid used for react keys
    const guid = useMemo(() => generateUUID(), []);

    // calculate the actual content with replacements. To display a mix of strings and react elements this function
    // creates an array of strings and react elements that is split further and further the more jsx replacements occur
    const content: Array<ReactElement | string> = useMemo(() => {
        return jsxReplace({
            text,
            replacements: replacements || {},
            maxReplacements,
            useDangerouslySetInnerHTML: dangerouslySetInnerHTML,
            guid,
        });
    }, [text, replacements, dangerouslySetInnerHTML, guid, maxReplacements]);

    return textStringChildren && React.isValidElement(textStringChildren)
        ? React.cloneElement(textStringChildren, elementProps, content)
        : <span>{content}</span>;
};

export default memo(TextStringComplex);
