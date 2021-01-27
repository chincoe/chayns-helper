import DialogPromise from '../DialogPromise';
import {createDialogResult, DialogButton} from '../utils';

/**
 * Improved chayns.dialog.confirm
 * @param message
 * @param options
 * @param buttons
 */
const confirm = (message: string, options?: { title?: string }, buttons?: DialogButton[]): DialogPromise<undefined> => new DialogPromise<undefined>((resolve: (value?: any) => any) => {
    chayns.dialog.confirm(options?.title || '', message ?? '', buttons)
        .then((type: any) => {
            resolve(createDialogResult(type));
        });
});

export default confirm;
