import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

/**
 * Alert dialog with only one button
 * @param {string} [message='']
 * @param {Object} [options={}]
 * @param {string} [options.title='']
 * @return {DialogPromise<dialogResult>}
 */
const alert = (message, options) => new DialogPromise((resolve) => {
    chayns.dialog.alert(options?.title || '', message ?? '')
        .then((type) => {
            resolve(createDialogResult(type));
        });
});

export default alert;
