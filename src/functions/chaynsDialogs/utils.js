/**
 * possible button Types
 * @type {{POSITIVE: number, CANCEL: number, NEGATIVE: number}}
 * @enum
 */
export const buttonType = {
    CANCEL: -1,
    NEGATIVE: 0,
    POSITIVE: 1
};

export const createDialogResult = (type, value = undefined) => ({ buttonType: type, value });
