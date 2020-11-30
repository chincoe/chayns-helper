import IframeDialogPromise from '../IFrameDialogPromise';
import { createDialogResult } from '../utils';

/**
 * IFrame Dialog
 * Possible Usage:
 * const { buttonType } = await chaynsDialog.iFrame({ url, ...config }, buttons)
 *      .data(dialogDataListener)
 *      .result(dialogResultListener)
 *      .positive(positiveButtonTypeListener)
 * @param {Object} options
 * @param {string} options.url
 * @param {?Object|*} [options.input=null]
 * @param {boolean} [options.seamless=true]
 * @param {boolean} [options.transparent=false]
 * @param {boolean} [options.waitCursor=true]
 * @param {?string} [options.maxHeight=null]
 * @param {?number} [options.width=null]
 * @param {?number} [options.customTransitionTimeout=null]
 * @param {?button[]} [buttons=[]]
 * @returns {IframeDialogPromise<dialogResult>}
 */
export default function iFrame(options, buttons) {
    return new IframeDialogPromise((resolve) => {
        const {
            url,
            input: dialogInput = null,
            seamless = true,
            transparent = false,
            waitCursor = true,
            maxHeight = null,
            width = null,
            customTransitionTimeout = null
        } = options || {};
        chayns.dialog.iFrame({
            url,
            input: dialogInput,
            buttons: buttons ?? [],
            seamless,
            transparent,
            waitCursor,
            maxHeight,
            width,
            customTransitionTimeout
        }).then((result) => {
            resolve(createDialogResult(result.buttonType, result?.value));
        });
    });
}
