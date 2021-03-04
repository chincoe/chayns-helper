import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

/**
 * Improved chayns.dialog.alert
 * @param message
 * @param options
 */
const alert = (message: string, options?: { title?: string }): DialogPromise<undefined> => new DialogPromise<undefined>(
    (resolve: (value?: any) => any) => {
        chayns.dialog.confirm(
            options?.title || '',
            message ?? '',
            [{ text: chayns.dialog.buttonText.OK, type: chayns.dialog.buttonType.POSITIVE }]
        )
            .then((type: any) => {
                resolve(createDialogResult(type));
            });
    });

export default alert;
