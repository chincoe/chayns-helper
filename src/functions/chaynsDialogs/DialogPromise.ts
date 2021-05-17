import { DialogResult } from './utils';

/**
 * Custom extension to Promise for dialogs
 * @extends Promise
 */
export default class DialogPromise<T> extends Promise<DialogResult<T>> {
    private isPending = true;

    constructor(resolveFn: (
        resolve: (value: DialogResult<T>) => unknown,
        reject: (value?: unknown) => unknown
    ) => void) {
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

    /**
     * Execute this function if buttonType is 1
     * @param resolveFn
     */
    public positive(resolveFn: (value?: T) => unknown): DialogPromise<T> {
        super.then((result) => {
            if (result.buttonType === 1) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * Execute this function if buttonType is 0
     * @param resolveFn
     */
    public negative(resolveFn: (value?: T) => unknown) : DialogPromise<T> {
        super.then((result) => {
            if (result.buttonType === 0) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * Execute this function if buttonType is -1
     * @param resolveFn
     */
    public cancelled(resolveFn: (value?: T) => unknown) : DialogPromise<T> {
        super.then((result) => {
            if (result.buttonType === -1) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * Execute this function if buttonType is the passed buttonType. Use this for custom buttons.
     * @param buttonType
     * @param resolveFn
     */
    public onType(buttonType: number, resolveFn: (value?: T) => unknown) : DialogPromise<T> {
        super.then((result) => {
            if (result.buttonType === buttonType) {
                resolveFn(result.value);
            }
        });
        return this;
    }

    /**
     * Close the dialog if it is still open
     * @returns success
     */
    public abort() : boolean {
        if (this.isPending) {
            chayns.dialog.close();
            return true;
        }
        return false;
    }
}
