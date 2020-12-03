import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

/**
 * Select an image from Pixabay
 * @param {Object} [options={}]
 * @param {string} [options.title]
 * @param {string} [options.message]
 * @param {boolean} [options.multiselect]
 * @param {button[]} [buttons]
 * @returns {DialogPromise<dialogResult>}
 */
export default function mediaSelect(options, buttons) {
    return new DialogPromise((resolve) => {
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
            .then((result) => {
                resolve(createDialogResult(result?.buttonType, result?.selection));
            });
    });
}
