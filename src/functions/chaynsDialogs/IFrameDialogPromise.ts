import DialogPromise from './DialogPromise';

/**
 * Custom extension to DialogPromise for the iFrame dialog
 * @extends DialogPromise
 */
export default class IframeDialogPromise extends DialogPromise<unknown> {
    /**
     * Add a dialogResultListener for the duration of this dialog
     * @param resolveFn
     */
    result(resolveFn: (value?: unknown) => unknown): IframeDialogPromise {
        chayns.dialog.addDialogResultListener(resolveFn);
        this.then(() => {
            chayns.dialog.removeDialogResultListener(resolveFn);
        });
        return this;
    }

    /**
     * Add a dialogDataListener for the duration of this dialog
     * @param resolveFn
     * @param getApiEvents
     */
    data(resolveFn: (value?: unknown) => unknown, getApiEvents?: boolean): IframeDialogPromise {
        chayns.dialog.addDialogDataListener(resolveFn, getApiEvents);
        this.then(() => {
            chayns.dialog.removeDialogDataListener(resolveFn, getApiEvents);
        });
        return this;
    }
}
