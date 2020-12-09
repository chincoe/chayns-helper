export enum buttonType {
    POSITIVE = 1,
    CANCEL = 0,
    NEGATIVE = -1
}

export interface DialogButton {
    text: string;
    buttonType: buttonType;
    collapseTime?: number;
    textColor?: string;
    backgroundColor?: string;
}

export interface DialogResult<T> {
    buttonType: buttonType;
    value?: T
}

export const createDialogResult = (type: buttonType, value?: any) => ({ buttonType: type, value });
