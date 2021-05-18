import DialogPromise from '../DialogPromise';
import { createDialogResult, DialogButton } from '../utils';

export interface MediaSelectDialogConfig {
    title?: string;
    message?: string;
    multiselect?: boolean;
}

/**
 * Improved chayns.dialog.mediaSelect
 * @param options
 * @param buttons
 */
export default function mediaSelect(
    options?: MediaSelectDialogConfig,
    buttons?: DialogButton[]
): DialogPromise<File | unknown> {
    return new DialogPromise<File | unknown>((resolve) => {
        const {
            title = '',
            message = '',
            multiselect = false
        } = options || {};
        chayns.dialog.mediaSelect({
            title,
            message,
            multiSelect: multiselect,
            buttons
        })
            .then((result: { buttonType: number, selection: unknown }) => {
                resolve(createDialogResult(result?.buttonType, result?.selection));
            });
    });
}
