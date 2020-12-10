import { helperConfig } from '../../config/chaynsHelperConfig';
import RequestError from './RequestError';
import colorLog from '../../utils/colorLog';
import ChaynsError from "./ChaynsError";
import { httpRequestResult } from './httpRequest';

export interface HandleRequestOptions {
    finallyHandler?: (responseOrError: Error | httpRequestResult) => any
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
                noReject = false
            } = options || {};
            const handleErrors = errorHandler || helperConfig.errorHandler;
            try {
                request
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((err) => {
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
