import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

/**
 * Type for input dialog
 * @type {{NUMBER: number, TEXTAREA: number, INPUT: number, PASSWORD: number}}
 * @enum
 */
export const inputType = {
    PASSWORD: chayns.dialog.inputType.PASSWORD,
    TEXTAREA: chayns.dialog.inputType.TEXTAREA,
    INPUT: chayns.dialog.inputType.INPUT,
    NUMBER: chayns.dialog.inputType.NUMBER
};

/**
 * Input dialog
 * @param {Object} [options={}]
 * @param {string} [options.message='']
 * @param {string} options.title
 * @param {string} options.placeholderText - placeholder
 * @param {string} options.text - default value
 * @param {string} options.textColor
 * @param {inputType} options.type - one of chaynsDialog.inputType
 * @param {string} options.regex
 * @param {function} options.formatter - function to format the input, {@link options.type} is required to use it
 * @param {string} options.pattern - pattern for input, can be used to get other keyboards (e.g. set to "[0-9]*" with
 *     number type for iOS)
 * @param {buttonType[]} options.disableButtonTypes - array of the buttonTypes that will be disabled if
 *     {@link options.regex} doesn't match the input
 * @param {button[]} [buttons=undefined]
 *
 * @property {inputType} type
 *
 * @return {DialogPromise<dialogResult>}
 */
export default function input(options, buttons) {
    return new DialogPromise((resolve) => {
        chayns.dialog.input({
            title: options?.title,
            message: options?.message ?? '',
            placeholderText: options?.placeholderText,
            text: options?.text,
            textColor: options?.textColor,
            buttons,
            type: options?.type,
            regex: options?.regex,
            formatter: options?.formatter,
            pattern: options?.pattern,
            disableButtonTypes: options?.disableButtonTypes
        })
            .then(({ buttonType: type, text }) => {
                resolve(createDialogResult(type, text));
            });
    });
}

input.type = { ...inputType };
