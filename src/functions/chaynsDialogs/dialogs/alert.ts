import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

/**
 * Improved chayns.dialog.alert
 * @param message
 * @param options
 */
const alertDialog = (
    message: string,
    options?: { title?: string }
): DialogPromise<undefined> => new DialogPromise<undefined>((resolve) => {
    chayns.dialog.alert(options?.title || '', message ?? '')
        .then((type: number) => {
            resolve(createDialogResult(type));
        });
});

export default alertDialog;
