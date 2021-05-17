import IframeDialogPromise from '../IFrameDialogPromise';
import { createDialogResult, DialogButton } from '../utils';

export interface IFrameDialogConfig {
    url: string;
    input?: Record<string, unknown>;
    seamless?: boolean;
    transparent?: boolean;
    waitCursor?: boolean;
    maxHeight?: string;
    width?: number;
    customTransitionTimeout?: number;
}

/**
 * Improve chayns.dialog.iFrame
 * @param options
 * @param buttons
 */
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
            input: dialogInput as Record<string, unknown>,
            buttons: buttons ?? [],
            seamless,
            transparent,
            waitCursor,
            maxHeight,
            width,
            customTransitionTimeout
        }).then((result: { buttonType: number, value?: unknown }) => {
            resolve(createDialogResult(result.buttonType, result?.value));
        });
    });
}
