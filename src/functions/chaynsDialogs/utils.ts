export enum ButtonType {
    POSITIVE = 1,
    CANCEL = 0,
    NEGATIVE = -1
}

export interface DialogButton {
    text: string;
    buttonType: ButtonType | number | 0 | 1 | -1;
    collapseTime?: number;
    textColor?: string;
    backgroundColor?: string;
}

export interface DialogResult<T> {
    buttonType: ButtonType | number | 0 | 1 | -1;
    value?: T;
}

export const createDialogResult = (type: ButtonType | number, value?: any) => ({
    buttonType: type,
    value
});
