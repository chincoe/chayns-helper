import IframeDialogPromise from '../IFrameDialogPromise';
import {createDialogResult, DialogButton} from '../utils';


export interface IFrameDialogConfig {
    url: string;
    input?: object|any;
    seamless?: boolean;
    transparent?: boolean;
    waitCursor?: boolean;
    maxHeight?: string;
    width?: number;
    customTransitionTimeout?: number;
}

export default function iFrame(options: IFrameDialogConfig, buttons?: DialogButton[]): IframeDialogPromise {
    return new IframeDialogPromise((resolve) => {
        const {
            url,
            input: dialogInput = null,
            seamless = true,
            transparent = false,
            waitCursor = true,
            maxHeight = undefined,
            width = undefined,
            customTransitionTimeout = undefined
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
        }).then((result: any) => {
            resolve(createDialogResult(result.buttonType, result?.value));
        });
    });
}
