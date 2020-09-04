import { TextString } from 'chayns-components';
import React, {
    memo, useMemo
} from 'react';
import isTobitEmployee from 'chayns-components/lib/utils/tobitEmployee';
import PropTypes from 'prop-types';
import generateUUID from '../functions/generateUid';
import types from '../functions/types';
import useElementProps from '../hooks/useElementProps';
import { TEXTSTRING_CONFIG, useTextStrings } from './TextStringMemo';

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
 * @param {string|*} [props.elementName='div']
 * @param {number} [props.maxReplacements] - Max. count of replacements per replacement item to avoid being stuck in an
 *     endless replacement loop
 * @param {boolean} [useDangerouslySetInnerHTML=false]
 * @param {string} [language='de']
 * @param {function} [onClick]
 * @param {boolean} [useClickToEdit=true]
 * @return {*}
 */
const TextStringComplex = memo((props) => {
    const {
        stringName,
        fallback,
        replacements = {},
        elementName = 'div',
        maxReplacements = 10,
        useDangerouslySetInnerHTML = false,
        language = 'de',
        onClick = () => null,
        useClickToEdit = true
    } = props;

    const [text] = useTextStrings(fallback ? { [stringName]: fallback } : [stringName]);

    const content = useMemo(() => {
        const guid = generateUUID();
        const vars = Object.keys(replacements);
        let result = [text];
        for (let i = 0; i < vars.length; i += 1) {
            let j = 0;
            const regex = new RegExp(vars[i]);
            while (j < maxReplacements && result.find((m) => chayns.utils.isString(m) && regex.test(m))) {
                const arrayIdx = result.findIndex((m) => chayns.utils.isString(m) && regex.test(m));
                const match = result[arrayIdx].match(regex);
                const isReplacerFunction = types.isFunction(replacements[vars[i]]);
                const ReplaceElement = replacements[vars[i]];
                result = [
                    ...result.slice(0, arrayIdx),
                    result[arrayIdx].substring(0, match.index),
                    (isReplacerFunction ? (
                        <ReplaceElement
                            {...match}
                            key={`${guid}:${i}.${j}`}
                        />
                    ) : replacements[vars[i]]),
                    result[arrayIdx].substring(match.index + match[0].length),
                    ...result.slice(arrayIdx + 1)
                ];
                j += 1;
            }
        }
        if (useDangerouslySetInnerHTML) {
            for (let i = 0; i < result.length; i += 1) {
                if (chayns.utils.isString(result[i])) {
                    result[i] = <span dangerouslySetInnerHTML={{ __html: result[i] }}/>;
                }
            }
        }
        return result;
    }, [text, replacements]);

    const elementProps = useElementProps(props, {
        stringName,
        fallback,
        replacements,
        elementName,
        maxReplacements,
        useDangerouslySetInnerHTML,
        useClickToEdit,
        language,
        onClick
    });

    // copied from chayns-components textstring
    const changeStringResult = (data, lang) => {
        if (data.buttonType === 1 && (data.text || data.value)) {
            TextString.changeTextString(
                `${TEXTSTRING_CONFIG.PREFIX}${stringName}`,
                useDangerouslySetInnerHTML ? data.value : data.text, lang.value
            )
                .then((result) => {
                    if (result.ResultCode === 0) {
                        chayns.dialog.alert(
                            '',
                            'Die Änderungen wurden erfolgreich gespeichert. Es kann bis zu 5 Minuten dauern, bis die Änderung sichtbar wird.'
                        );
                    } else {
                        chayns.dialog.alert('', 'Es ist ein Fehler aufgetreten.');
                    }
                })
                .catch(() => {
                    chayns.dialog.alert('', 'Es ist ein Fehler aufgetreten.');
                });
        }
    };

    // copied from chayns-components textstring
    const changeStringDialog = (sName, lang) => {
        const string = TextString.getTextString(sName, TextString.languages.find((l) => l.value === lang.value).code);
        if (string) {
            if (useDangerouslySetInnerHTML) {
                chayns.register({ apiDialogs: true });
                chayns.dialog.iFrame({
                    width: Math.min(window.innerWidth, 400),
                    url: 'https://frontend.tobit.com/dialog-html-editor/v1.0/',
                    input: string,
                    title: sName,
                    message: `Sprache: ${lang.name}`,
                    buttons: [
                        {
                            text: 'Speichern',
                            buttonType: 1,
                        }, {
                            text: 'Abbrechen',
                            buttonType: -1,
                        }
                    ],
                })
                    .then((result) => {
                        changeStringResult(result, lang);
                    });
            } else {
                chayns.dialog.input({
                    title: sName,
                    message: `Sprache: ${lang.name}`,
                    text: string,
                    buttons: [
                        {
                            text: 'Speichern',
                            buttonType: 1,
                        }, {
                            text: 'Abbrechen',
                            buttonType: -1,
                        }
                    ],
                })
                    .then((result) => {
                        changeStringResult(result, lang);
                    });
            }
        } else {
            chayns.dialog.alert(sName, 'Der textstring existiert nicht.');
        }
    };

    // copied from chayns-components textstring
    const selectTextStringLanguage = (sName) => {
        chayns.dialog.select({
            title: `TextString bearbeiten: ${sName}`,
            message: `Wähle die Sprache: (angezeigt wird ${TextString.languages.find(
                (l) => l.code === (language || TextString.language)
            ).name})`,
            quickfind: 0,
            multiselect: 0,
            list: TextString.languages,
        })
            .then((data) => {
                if (data.buttonType === 1 && data.selection && data.selection.length > 0) {
                    const lang = data.selection[0];
                    // language is already selected
                    if (lang.value === TextString.languages.find(
                        (l) => l.code === (language || TextString.language)
                    ).value) {
                        changeStringDialog(sName, lang);
                    } else {
                        // Get lib
                        let library = null;
                        let middle = 'langRes';
                        const globalLang = TextString.languages.find(
                            (l) => l.code === TextString.language
                        ).value;
                        Object.keys(TextString.textStrings[globalLang])
                            .forEach((lib) => {
                                if (TextString.textStrings[globalLang][lib][sName]) {
                                    library = lib;
                                    // eslint-disable-next-line prefer-destructuring
                                    middle = TextString.textStrings[globalLang][lib].middle;
                                }
                            });
                        TextString.loadLibrary(
                            library, middle,
                            TextString.languages.find((l) => l.value === lang.value).code
                        )
                            .then(() => {
                                changeStringDialog(sName, lang);
                            });
                    }
                }
            });
    };

    const Component = elementName;

    return (
        <Component
            {...elementProps}
            onClick={(e) => {
                // copied from chayns-components textstring
                if (e.ctrlKey && useClickToEdit) {
                    isTobitEmployee()
                        .then(() => {
                            selectTextStringLanguage(`${TEXTSTRING_CONFIG.PREFIX}${stringName}`);
                        })
                        .catch((err) => {
                            // eslint-disable-next-line no-console
                            console.warn(err);
                        });
                    e.stopPropagation();
                } else {
                    onClick();
                }
            }}
        >
            {content}
        </Component>
    );
});

TextStringComplex.propTypes = {
    useClickToEdit: PropTypes.bool,
    onClick: PropTypes.func,
    useDangerouslySetInnerHTML: PropTypes.bool,
    language: PropTypes.string,
    maxReplacements: PropTypes.number,
    stringName: PropTypes.string.isRequired,
    fallback: PropTypes.string.isRequired,
    replacements: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.string])),
    elementName: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.func])
};

TextStringComplex.defaultProps = {
    useClickToEdit: true,
    onClick: () => null,
    useDangerouslySetInnerHTML: false,
    language: 'de',
    elementName: 'div',
    maxReplacements: 10,
    replacements: {}
};

TextStringComplex.displayName = 'TextStringComplex';

export default TextStringComplex;
