/**
 * @callback fullResolveFn
 * @param {Object} result
 * @param {number} result.buttonType
 * @param {?*} result.value
 */

/**
 * @callback dialogThen
 * @param {function(*): *|void} resolveFn
 * @returns {DialogPromise<dialogResult>}
 */

/**
 * @callback fullDialogThen
 * @param {fullResolveFn} resolveFn
 * @returns {DialogPromise<dialogResult>}
 */

/**
 * Custom extension to Promise for dialogs
 * @extends Promise
 */
export default class DialogPromise extends Promise {
    isPending = true;

    constructor(resolveFn) {
        super((resolve, reject) => {
            new Promise((res, rej) => {
                resolveFn(res, rej);
            }).then((result) => {
                this.isPending = false;
                resolve(result);
            }, (result) => {
                this.isPending = false;
                reject(result);
            });
        });
    }

    /**
     * @param {function(*): *|void} resolveFn
     * @returns {DialogPromise<dialogResult>}
     */
    positive(resolveFn) {
        super.then((result) => {
            if (result.buttonType === 1) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * @param {function(*): *|void} resolveFn
     * @returns {DialogPromise<dialogResult>}
     */
    negative(resolveFn) {
        super.then((result) => {
            if (result.buttonType === 0) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * @param {function(*): *|void} resolveFn
     * @returns {DialogPromise<dialogResult>}
     */
    cancelled(resolveFn) {
        super.then((result) => {
            if (result.buttonType === -1) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * close the dialog
     * @returns {boolean} success
     */
    abort() {
        if (this.isPending) {
            chayns.dialog.close();
            return true;
        }
        return false;
    }
}
