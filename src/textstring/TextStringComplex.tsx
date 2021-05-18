import React, {
    FunctionComponent, memo, ReactElement, ReactNode, useEffect, useMemo
} from 'react';
import { TextString } from 'chayns-components';
import isTobitEmployee from 'chayns-components/dist/esm/utils/tobitEmployee';
import generateGuid from '../functions/generateGuid';
import jsxReplace, { JsxReplacements } from './jsxReplace';
import TEXTSTRING_CONFIG from './textstringConfig';
import isNullOrWhiteSpace from '../utils/isNullOrWhiteSpace';
import colorLog from '../utils/colorLog';

interface TextStringReplacerConfig {
    children: string | ReactNode;
    textStringChildren?: ReactNode | null;
    replacements: JsxReplacements;
    dangerouslySetInnerHTML?: boolean;
    maxReplacements?: number;
    stringName: string;
    fallback: string;
    onClick?: (...arg: unknown[]) => unknown;
    className?: string;
}

const TextStringReplacer: FunctionComponent<TextStringReplacerConfig> = ({
    children,
    textStringChildren,
    dangerouslySetInnerHTML,
    replacements,
    maxReplacements,
    stringName,
    fallback,
    ...props
}) => {
    // get the string manually if it hasn't been passed by the chayns-components textstring component
    const calculatedString = TextString.getTextString(stringName) || fallback;
    const text = typeof (children) === 'string'
        ? children
        : calculatedString;

    // generate a guid used for react keys
    const guid = useMemo(() => generateGuid(), []);

    // calculate the actual content with replacements. To display a mix of strings and react elements this function
    // creates an array of strings and react elements that is split further and further the more jsx replacements occur
    const content: Array<ReactElement | string> = useMemo(() => jsxReplace({
        text,
        replacements: replacements || {},
        maxReplacements,
        useDangerouslySetInnerHTML: dangerouslySetInnerHTML,
        guid,
    }), [text, replacements, dangerouslySetInnerHTML, guid, maxReplacements]);

    const elementProps = Array.isArray(textStringChildren)
        ? props
        : {
            ...props,
            className: `${props?.className
            || ''} ${(textStringChildren as { props: { className: string } })?.props?.className || ''}`
        };

    return textStringChildren && React.isValidElement(textStringChildren)
        ? React.cloneElement(textStringChildren, elementProps, content)
        : <p {...elementProps}>{content}</p>;
};

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
    autoCreation: propAutoCreation,
    ...props
}) => {
    const autoCreation = propAutoCreation ?? TEXTSTRING_CONFIG.autoCreation;
    // create missing textStrings if opened by an authorized developer
    useEffect(() => {
        (async () => {
            try {
                console.debug(
                    ...colorLog.gray(`[TextString<${stringName}>]`),
                    `Auto creation ${autoCreation ? 'enabled' : 'disabled'}`
                );
                // TODO: Remove
                console.debug({
                    autoCreation,
                    propAutoCreation,
                    fallbackExists: !isNullOrWhiteSpace(fallback),
                    stringNameExists: !isNullOrWhiteSpace(stringName),
                    stringDoesNotExists: (TextString.getTextString(`${TEXTSTRING_CONFIG.prefix}${stringName}`)
                        ?? null) === null,
                    germanStringDoesNotExists: (TextString.getTextString(
                        `${TEXTSTRING_CONFIG.prefix}${stringName}`, 'de'
                    ) ?? null) === null,
                    libnameExists: !isNullOrWhiteSpace(TEXTSTRING_CONFIG.libName),
                    prefixExists: !isNullOrWhiteSpace(TEXTSTRING_CONFIG.prefix),
                    authenticated: chayns.env.user.isAuthenticated,
                    config: TEXTSTRING_CONFIG
                });
                if (autoCreation
                    && !isNullOrWhiteSpace(fallback)
                    && !isNullOrWhiteSpace(stringName)
                    && (TextString.getTextString(`${TEXTSTRING_CONFIG.prefix}${stringName}`) ?? null) === null
                    && (TextString.getTextString(`${TEXTSTRING_CONFIG.prefix}${stringName}`, 'de') ?? null) === null
                    && !isNullOrWhiteSpace(TEXTSTRING_CONFIG.libName)
                    && !isNullOrWhiteSpace(TEXTSTRING_CONFIG.prefix)
                    && chayns.env.user.isAuthenticated
                ) {
                    isTobitEmployee().then(async () => {
                        console.debug(
                            ...colorLog.gray(`[TextString<${stringName}>]`),
                            'Tobit Employee detected'
                        );
                        const libResponse = await fetch(
                            // eslint-disable-next-line max-len
                            `https://webapi.tobit.com/TextStringService/v1.0/langstrings/${TEXTSTRING_CONFIG.libName}?language=de`,
                            {
                                method: 'GET',
                                cache: 'no-cache',
                                headers: new Headers({
                                    Authorization: `Bearer ${chayns.env.user.tobitAccessToken}`
                                })
                            }
                        );
                        const libContent = await libResponse.json();
                        // TODO: Remove
                        console.debug({
                            libContent,
                            libResponse,
                        });
                        if (libResponse.status === 200 && libContent
                            && Object.prototype.toString.call(libContent) === '[object Object]'
                            && Object.keys(libContent)
                                .find((name) => name === `${TEXTSTRING_CONFIG.prefix}${stringName}`)
                        ) {
                            console.debug(
                                ...colorLog.gray(`[TextString<${stringName}>]`),
                                'TextString not found, creating TextString'
                            );
                            const response = await fetch(
                                // eslint-disable-next-line max-len
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
                                        textPL: '',
                                        toTranslate: ['en', 'nl', 'it', 'fr', 'pt', 'es', 'tr', 'pl']
                                    })
                                }
                            );
                            if (response && response.status === 201) {
                                // eslint-disable-next-line no-console
                                console.warn(
                                    ...colorLog.gray(`[TextString<${stringName}>]`),
                                    // eslint-disable-next-line max-len
                                    `Created string '${TEXTSTRING_CONFIG.prefix}${stringName}' as '${fallback}'. Translated to: en, nl, it, fr, pt, es, tr, pl.`
                                );
                            }
                        }
                    });
                }
            } catch (e) {
                console.debug(
                    ...colorLog.gray(`[TextString<${stringName}>]`),
                    'An error occurred during auto creation:', e
                );
            }
        })();
    }, []);
    // noinspection RequiredAttributes
    return (
        <TextString
            stringName={`${TEXTSTRING_CONFIG.prefix}${stringName}`}
            fallback={fallback}
            useDangerouslySetInnerHTML={false}
            language={language}
        >
            {
                /* @ts-expect-error children are required but set by TextString via React.CloneElement */
                <TextStringReplacer
                    dangerouslySetInnerHTML={useDangerouslySetInnerHTML}
                    maxReplacements={maxReplacements}
                    replacements={replacements}
                    textStringChildren={children}
                    stringName={stringName}
                    fallback={fallback}
                    onClick={(children as ReactElement)?.props?.onClick}
                    {...props}
                />
            }
        </TextString>
    );
};

export default memo(TextStringComplex);
