import DialogPromise from './DialogPromise';

/**
 * Custom extension to DialogPromise for the iFrame dialog
 * @extends DialogPromise
 */
export default class IframeDialogPromise extends DialogPromise<any> {
    /**
     * Add a dialogResultListener for the duration of this dialog
     * @param resolveFn
     */
    result(resolveFn: (value?: any) => any) {
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
    data(resolveFn: (value?: any) => any, getApiEvents?: boolean) {
        chayns.dialog.addDialogDataListener(resolveFn, getApiEvents);
        this.then(() => {
            chayns.dialog.removeDialogDataListener(resolveFn, getApiEvents);
        });
        return this;
    }
}
