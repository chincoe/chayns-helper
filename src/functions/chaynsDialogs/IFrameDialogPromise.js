import DialogPromise from './DialogPromise';

/**
 * Custom extension to DialogPromise for the iFrame dialog
 * @extends DialogPromise
 */
export default class IframeDialogPromise extends DialogPromise {
    /**
     * @param {function(*): *|void} resolveFn
     * @returns {DialogPromise<dialogResult>}
     */
    result(resolveFn) {
        chayns.dialog.addDialogResultListener(resolveFn);
        this.then(() => {
            chayns.dialog.removeDialogResultListener(resolveFn);
        });
        return this;
    }

    /**
     * @param {function(*): *|void} resolveFn
     * @param {boolean} getApiEvents - get sent data that has isApiEvent set
     * @returns {DialogPromise<dialogResult>}
     */
    data(resolveFn, getApiEvents) {
        chayns.dialog.addDialogDataListener(resolveFn, getApiEvents);
        this.then(() => {
            chayns.dialog.removeDialogDataListener(resolveFn, getApiEvents);
        });
        return this;
    }
}
