import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

/**
 * Confirm dialog
 * @param {string} [message='']
 * @param {button[]} [buttons=undefined]
 * @param {Object} [options={}]
 * @param {string} [options.title='']
 * @return {DialogPromise<dialogResult>}
 */
const confirm = (message, options, buttons) => new DialogPromise((resolve) => {
    chayns.dialog.confirm(options?.title || '', message ?? '', buttons)
        .then((type) => {
            resolve(createDialogResult(type));
        });
});

export default confirm;
