import DialogPromise from '../DialogPromise';
import { createDialogResult, DialogButton } from '../utils';

/**
 * Improved chayns.dialog.confirm
 * @param message
 * @param options
 * @param buttons
 */
const confirm = (
    message: string,
    options?: { title?: string },
    buttons?: DialogButton[]
): DialogPromise<undefined> => new DialogPromise<undefined>((resolve) => {
    chayns.dialog.confirm(options?.title || '', message ?? '', buttons)
        .then((type: number) => {
            resolve(createDialogResult(type));
        });
});

export default confirm;
