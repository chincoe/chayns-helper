import { DialogResult } from "./utils";

/**
 * Custom extension to Promise for dialogs
 * @extends Promise
 */
export default class DialogPromise<T> extends Promise<DialogResult<T>> {
    isPending = true;

    constructor(resolveFn: (resolve: (value?: any) => any, reject: (value?: any) => any) => void) {
        super((resolve, reject) => {
            new Promise<DialogResult<T>>((res, rej) => {
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

    positive(resolveFn: (value?: T) => any) {
        super.then((result) => {
            if (result.buttonType === 1) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    negative(resolveFn: (value?: T) => any) {
        super.then((result) => {
            if (result.buttonType === 0) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    cancelled(resolveFn: (value?: T) => any) {
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
