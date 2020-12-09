export const enum ButtonType {
    POSITIVE = 1,
    CANCEL = 0,
    NEGATIVE = -1
}

export interface DialogButton {
    text: string;
    buttonType: typeof ButtonType|number;
    collapseTime?: number;
    textColor?: string;
    backgroundColor?: string;
}

export interface DialogResult<T> {
    buttonType: typeof ButtonType|number;
    value?: T
}

export const createDialogResult = (type: typeof ButtonType|number, value?: any) => ({
    buttonType: type,
    value
});
