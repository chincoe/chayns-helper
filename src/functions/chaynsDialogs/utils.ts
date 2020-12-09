export const enum ButtonTypeEnum {
    POSITIVE = 1,
    CANCEL = 0,
    NEGATIVE = -1
}

export const ButtonType = {
    POSITIVE: 1,
    CANCEL: 0,
    NEGATIVE: -1
}

export interface DialogButton {
    text: string;
    buttonType: typeof ButtonTypeEnum|number;
    collapseTime?: number;
    textColor?: string;
    backgroundColor?: string;
}

export interface DialogResult<T> {
    buttonType: typeof ButtonTypeEnum|number;
    value?: T
}

export const createDialogResult = (type: typeof ButtonTypeEnum|number, value?: any) => ({
    buttonType: type,
    value
});
