import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

/**
 * Improved chayns.dialog.alert
 * @param message
 * @param options
 */
const alert = (message: string, options?: { title?: string }): DialogPromise<undefined> => new DialogPromise<undefined>(
    (resolve: (value?: any) => any) => {
        chayns.dialog.alert(options?.title || '', message ?? '')
            .then((type: any) => {
                resolve(createDialogResult(type));
            });
    });

export default alert;
