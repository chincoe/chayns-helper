import DialogPromise from './DialogPromise';


/**
 * Custom extension to DialogPromise for the iFrame dialog
 * @extends DialogPromise
 */
export default class IframeDialogPromise extends DialogPromise<any> {
    result(resolveFn: (value?: any) => any) {
        chayns.dialog.addDialogResultListener(resolveFn);
        this.then(() => {
            chayns.dialog.removeDialogResultListener(resolveFn);
        });
        return this;
    }

    data(resolveFn: (value?: any) => any, getApiEvents?: boolean) {
        chayns.dialog.addDialogDataListener(resolveFn, getApiEvents);
        this.then(() => {
            chayns.dialog.removeDialogDataListener(resolveFn, getApiEvents);
        });
        return this;
    }
}
