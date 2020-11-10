import { helperConfig } from '../../config/chaynsHelperConfig';
import localStorage from '../../other/localStorageHelper';
import showWaitCursor from '../waitCursor';
import RequestError from './RequestError';
import colorLog from '../../_internal/colorLog';

/**
 * @callback requestErrorHandler
 * @param {Error|RequestError} error
 * @param {?number} statusCode
 * @param {function(*)} resolve
 * @param {function(*)} reject
 */
/**
 * @typedef {Object} waitCursorOptions
 * @property {string} [text=undefined] - Text that should be displayed after the {@link textTimeout}
 * @property {number} [textTimeout=5000] - Timeout in ms after which {@link text} should be displayed
 * @property {number} [timeout=300] - timeout in ms after which the chayns waitCursor should be displayed
 */
/**
 * @callback cacheResolverCallback
 * @param {*} value - Value that the callback should serialize so it can be cached
 * @async
 * @return {Promise<*>|*}
 */

/**
 * @typedef {Object} cacheOptions
 * @property {string} key - The name used to cache this asset in local storage
 * @property {number} [duration=5] - The duration in minutes after which the cache will be refreshed
 * @property {cacheResolverCallback} [cacheResolver] - callback that transforms e.g. a promise to a serialized value,
 *     e.g. a string
 */

/**
 * handleRequest()
 * try/catch/finally wrapper for requests.
 * Pass an error handler and/or define a default with initChaynsHelper()
 * Usage: await handleRequest(fetch(whatever), console.error, {})
 *
 * @param {Promise<*>} request - Promise of the un-awaited request
 * @param {requestErrorHandler} [errorHandler=undefined] - Function to handle error statusCodes. Defaults to
 *     defaultErrorHandler.js
 * @param {Object} [options={}] - other options for this wrapper
 * @param {function} [options.finallyHandler] - Function that should always be executed after the request
 * @param {boolean|waitCursorOptions} [options.waitCursor] - Show chayns waitCursor. Set true to show. Set to an object
 *     for more options
 * @param {string|cacheOptions} [options.cache]  (optional) string/object: Set to a string to cache the request in
 *     local storage. Only works if the request returns appropriate data, e.g. a string OR if a cacheResolver is
 *     defined. Set to an object for more detailed cache control.
 * @param {boolean} [options.noReject=false] - Do not reject promise on error, resolve with null instead
 * @throws {RequestError}
 * @public
 * @async
 * @return result {Promise<unknown>}
 */
export default function handleRequest(
    // promise: The un-awaited request.
    request,
    // function: An error handler. Defaults to defaultErrorHandler.js in this folder
    errorHandler,
    // object: other options for this handler
    options
) {
    return new Promise(
        (resolve, reject) => {
            const {
                finallyHandler = () => null, // function: is always executed
                waitCursor = false, // bool/object: true or { text, textTimeout, timeout }
                cache = null, // string/object: cacheKey or { key, duration, cacheResolver }
                noReject = false
            } = options || {};
            const useWaitCursor = !!waitCursor;
            const {
                text = undefined,
                textTimeout = 5000,
                timeout = 300
            } = (chayns.utils.isObject(waitCursor)
                 ? waitCursor
                 : {});
            const handleErrors = errorHandler || helperConfig.errorHandler;
            let hideWaitCursor = () => {};
            try {
                if (useWaitCursor) hideWaitCursor = showWaitCursor({ text, textTimeout, timeout });
                if (cache) {
                    const cacheKey = chayns.utils.isObject(cache) ? `${cache?.key}` : `${cache}`;
                    const duration = chayns.utils.isObject(cache) ? (cache?.duration ?? 5) : 5;
                    if (localStorage.keys[cacheKey]) {
                        if (localStorage.get(cacheKey)) resolve(localStorage.get(cacheKey));
                    } else {
                        localStorage.add(cacheKey, duration);
                    }
                }
                request
                    .then((result) => {
                        if (cache) {
                            const cacheKey = chayns.utils.isObject(cache) ? `${cache?.key}` : `${cache}`;
                            const cacheResolver = (chayns.utils.isObject(
                                cache
                            ) ? cache?.cacheResolver : null) || ((v) => v);
                            localStorage.set(cacheKey, cacheResolver(result));
                        }
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
