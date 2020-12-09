import DialogPromise from '../DialogPromise';
import {createDialogResult, DialogButton} from '../utils';

export const enum inputTypeEnum {
    DEFAULT = 0,
    PASSWORD = 1,
    TEXTAREA = 2,
    INPUT = 2,
    NUMBER = 3
};

export const inputType = {
    DEFAULT: 0,
    PASSWORD: 1,
    TEXTAREA: 2,
    INPUT: 2,
    NUMBER: 3
};

export interface InputDialogConfig {
    title?: string;
    message?: string;
    placeholderText?: string;
    text?: string;
    textColor?: string;
    type?: typeof inputTypeEnum|number;
    regex?: string;
    formatter?: (value: any) => any;
    pattern?: string;
    disableButtonTypes?: number[];
}

export default function input(options?: InputDialogConfig, buttons?: DialogButton[]): DialogPromise<string> {
    return new DialogPromise<string>((resolve) => {
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
            .then(({ buttonType: type, text }: any) => {
                resolve(createDialogResult(type, text));
            });
    });
}

input.type = { ...inputType };
