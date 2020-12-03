import { helperConfig } from '../../config/chaynsHelperConfig';
import showWaitCursor from '../waitCursor';
import RequestError from './RequestError';
import colorLog from '../../utils/colorLog';
import ChaynsError from "./ChaynsError";

export interface HandleRequestOptions {
    finallyHandler?: () => any
    waitCursor?: boolean| {
        text?: string,
        textTimeout?: number,
        timeout?: number
    },
    noReject?: boolean
}

export default function handleRequest(
    // promise: The un-awaited request.
    request: Promise<any>,
    // function: An error handler. Defaults to defaultErrorHandler.js in this folder
    errorHandler?: (err: Error|RequestError|ChaynsError, statusCode?: number, resolve?: (value?: any) => any, reject?: (value?: any) => any) => any,
    // object: other options for this handler
    options?: HandleRequestOptions
): Promise<any> {
    return new Promise(
        (resolve, reject) => {
            const {
                finallyHandler = () => null, // function: is always executed
                waitCursor = false, // bool/object: true or { text, textTimeout, timeout }
                noReject = false
            } = options || {};
            const useWaitCursor: boolean = !!waitCursor;
            // @ts-ignore
            const { text = undefined, textTimeout = 5000, timeout = 300 } = (chayns.utils.isObject(waitCursor)
                 ? waitCursor
                 : {});
            const handleErrors = errorHandler || helperConfig.errorHandler;
            let hideWaitCursor = () => {};
            try {
                if (useWaitCursor) hideWaitCursor = showWaitCursor({ text, textTimeout, timeout });
                request
                    .then((result) => {
                        resolve(result);
                    })
                    .finally(() => { hideWaitCursor(); })
                    .catch((err) => {
                        hideWaitCursor();
                        // eslint-disable-next-line no-console
                        if (!(err instanceof RequestError)) {
                            console.error(...colorLog({
                                '[HandleRequest]': 'color: #aaaaaa'
                            }), err);
                        }
                        let errorResult;
                        try {
                            errorResult = handleErrors(err, err?.statusCode, resolve, reject);
                        } catch (e) {
                            console.error(...colorLog({
                                '[HandleRequest]': 'color: #aaaaaa',
                                'Error in error handler:': ''
                            }), e);
                        }
                        if (!noReject) {
                            reject(errorResult || err);
                        } else {
                            resolve(errorResult || null);
                        }
                    })
                    .then(finallyHandler, finallyHandler);
            } catch (err) {
                hideWaitCursor();
                // eslint-disable-next-line no-console
                if (!(err instanceof RequestError)) {
                    console.error(...colorLog({
                        '[HandleRequest]': 'color: #aaaaaa'
                    }), err);
                }
                let errorResult;
                try {
                    errorResult = handleErrors(err, err?.statusCode, resolve, reject);
                } catch (e) {
                    console.error(...colorLog({
                        '[HandleRequest]': 'color: #aaaaaa',
                        'Error in error handler:': ''
                    }), e);
                }
                if (!noReject) {
                    reject(errorResult || err);
                } else {
                    resolve(errorResult || null);
                }
            }
        }
    );
}
