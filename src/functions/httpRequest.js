import generateUUID from '../functions/generateUid';
import { chaynsHelperConfig } from '../chaynsHelperConfig';
import { showWaitCursor } from './waitCursor';
import types from './types';
import localStorage from '../other/localStorageHelper';

/**
 * Custom error for error statusCodes or other errors during a httpRequest
 * @public
 */
export class RequestError extends Error {
    /**
     * @param {string} message - Error message
     * @param {number} statusCode - Response status code
     */
    constructor(message, statusCode) {
        super();
        this.name = `Status${statusCode}HttpRequestError`;
        this.statusCode = statusCode;
    }
}

/**
 * @callback requestErrorHandler
 * @param {Error|RequestError} error
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
 * @param {function} options.finallyHandler - Function that should always be executed after the request
 * @param {boolean|waitCursorOptions} options.waitCursor - Show chayns waitCursor. Set true to show. Set to an object
 *     for more options
 * @param {string} [options.waitCursor.text=undefined] - Text to be displayed after the textTimeout
 * @param {number} [options.waitCursor.textTimeout=5000] - Timeout after which the text appears in the wait cursor
 * @param {number} [options.waitCursor.timeout=300] - Timeout after which the waitCursor is displayed
 * @param {string|cacheOptions} [options.cache]  (optional) string/object: Set to a string to cache the request in
 *     local storage. Only works if the request returns appropriate data, e.g. a string OR if a cacheResolver is
 *     defined. Set to an object for more detailed cache control.
 * @param {string} options.cache.key - The name used to cache this asset in local storage
 * @param {number} [options.cache.duration=5] - The duration in minutes after which the cache will be refreshed
 * @param {cacheResolverCallback} [options.cache.cacheResolver] - Function to transform the cache content before
 *     setting, e.g. reading a request body
 *
 * @public
 * @async
 * @return result {Promise<unknown>}
 */
export const handleRequest = (
    // promise: The un-awaited request.
    request,
    // function: An error handler. Defaults to defaultErrorHandler.js in this folder
    errorHandler = undefined,
    // object: other options for this handler
    options = {}
) => new Promise(
    (resolve, reject) => {
        const {
            finallyHandler = () => null, // function: is always executed
            waitCursor = false, // bool/object: true or { text, textTimeout, timeout }
            cache = null // string/object: cacheKey or { key, duration, cacheResolver }
        } = (options || {});
        const useWaitCursor = !!waitCursor;
        const { text = undefined, textTimeout = 5000, timeout = 300 } = (types.isObject(waitCursor) ? waitCursor : {});
        const handleErrors = errorHandler || chaynsHelperConfig.getRequestErrorHandler();
        let hideWaitCursor = () => null;
        try {
            if (useWaitCursor) hideWaitCursor = showWaitCursor(text, textTimeout, timeout);
            if (cache) {
                const cacheKey = types.isObject(cache) ? `${cache?.key}` : `${cache}`;
                const duration = types.isObject(cache) ? (cache?.duration ?? 5) : 5;
                if (localStorage.keys[cacheKey]) {
                    if (localStorage.get(cacheKey)) resolve(localStorage.get(cacheKey));
                } else {
                    localStorage.add(cacheKey, duration);
                }
            }
            request
                .then((result) => {
                    if (cache) {
                        const cacheKey = types.isObject(cache) ? `${cache?.key}` : `${cache}`;
                        const cacheResolver = (types.isObject(
                            cache
                        ) ? cache?.cacheResolver : null) || function (v) { return v; };
                        localStorage.set(cacheKey, cacheResolver(result));
                    }
                    resolve(result);
                })
                .finally(() => { hideWaitCursor(); })
                .catch((err) => {
                    hideWaitCursor();
                    // eslint-disable-next-line no-console
                    console.notLive.error(err);
                    handleErrors(err);
                    reject();
                })
                .finally(finallyHandler);
        } catch (err) {
            hideWaitCursor();
            // eslint-disable-next-line no-console
            console.notLive.error(err);
            handleErrors(err);
            reject();
        }
    }
);

/**
 * @callback onProgressHandler
 * @param {number} percentage - Percentage of content downloaded
 * @param {number} loaded - Data already loaded
 * @param {number} total - Total data to load
 */
/**
 * @callback statusCodeHandler
 * @param {Response} response - The response of the request
 */
/**
 * Helper to send httpRequests. Works best if wrapped with handleRequest()
 * @param {string} address - Address of the request
 * @param {Object} [config={}] - Fetch config
 * @param {string} [config.method='GET'] - HttpMethod
 * @param {Object} [config.headers] - Additional HttpHeaders
 * @param {boolean} [config.useChaynsAuth] - Add user token as authorization if available
 * @param {*} [config.body] - Body of the request
 * @param {*} [config.signal] - Signal to abort request while running, use with RTK thunks
 * @param {string} [processName='HttpRequest'] - Name of the process in the logs
 * @param {Object} [options={}] - Additional options for the request
 * @param {boolean} [options.returnJson=true] - Returns response.json(), incompatible with {@link options.returnBlob}
 * @param {boolean} [options.returnBlob=false] - Returns response.blob(), incompatible with {@link options.returnJson}
 * @param {boolean} [options.ignoreErrors=false] - Don't log or throw errors for this request. Return null on error
 * @param {boolean} [options.useFetchApi=true] - use fetch(), use XMLHttpRequest otherwise
 * @param {number[]} [options.ignoreStatusCodes=[]] - Ignore errors for these status codes
 * @param {boolean} [options.stringifyBody=true] - Call JSON.stringify(body) for the body passed to this function
 * @param {Object} [options.additionalLogData={}] - Additional data to be logged with this request
 * @param {boolean} [options.autoRefreshToken=true] - Automatically try to refresh the token once if it expired
 * @param {Object} [options.statusCodeHandlers={}] - A way to handle the return value and handling for specific
 *     status codes. Usage:
 *     1. { [statusCodeOrRegexString] : (response) => { my code }, ... } OR
 *     2. { codes: [...statusCodeArray], handler: (response) => { switch(response.status){...} } }
 *     - handler always receives entire response as parameter, not just the body
 *     - value returned from handler is returned as result of the request
 *     - handler can be async and will be awaited
 * @param {number[]} [options.statusCodeHandlers.codes] - Array of statusCodes to handle
 * @param {statusCodeHandler} [options.statusCodeHandlers.handler] {Function} (optional) Handler function for these
 *     status codes
 * @param {statusCodeHandler} [options.statusCodeHandlers.200]
 * @param {statusCodeHandler} [options.statusCodeHandlers.201]
 * @param {statusCodeHandler} [options.statusCodeHandlers.204]
 * @param {statusCodeHandler} [options.statusCodeHandlers.304]
 * @param {statusCodeHandler} [options.statusCodeHandlers.400]
 * @param {statusCodeHandler} [options.statusCodeHandlers.401]
 * @param {statusCodeHandler} [options.statusCodeHandlers.403]
 * @param {statusCodeHandler} [options.statusCodeHandlers.404]
 * @param {statusCodeHandler} [options.statusCodeHandlers.500]
 * @param {statusCodeHandler} [options.statusCodeHandlers.503]
 * @param {onProgressHandler} [options.onProgress] - Gets called multiple times during the download of bigger data,
 *     e.g.
 *     for progress bars. Prevents the use of .json() and .blob() if useFetchApi is true. A param "stringBody" is added
 *     to read the body instead.
 * @param {boolean} [options.addHashToUrl=false] - Add a random hash as URL param to bypass the browser cache
 *
 * @async
 * @public
 * @return {Promise<string|object|object[]|Response|*>} - response or response body
 */
const httpRequest = async (
    // full request address. URLs should be defined as functions or constants in a separate file
    address,
    // fetch config
    config = {},
    // processName for logs
    processName = 'HttpRequest',
    // options for this helper
    options = {},
) => new Promise((resolve, reject) => {
    (async () => {
        /** INPUT HANDLING */
            // read options object
        const {
                // bool: returns response.json()
                returnJson = true,
                // bool: returns response.blob()
                returnBlob = false,
                // bool: don't throw errors on error status codes, return null instead
                ignoreErrors = false,
                // bool: use fetch(), use XMLHttpRequest otherwise
                useFetchApi = true,
                // array: don't log errors on these status codes
                ignoreStatusCodes = [],
                // bool: call JSON.stringify() on the body passed to this function
                stringifyBody = true,
                // object: additional data to be logged
                additionalLogData = {},
                // bool: automatically try to refresh the token once if it is expired
                autoRefreshToken = true,
                /* Execute these callbacks on specific status codes. Format:
                 * 1. { [statusCodeOrRegexString] : (response) => { my code }, ... }
                 * 2. { codes: [...statusCodeArray], handler: (response) => { my code } }
                 * - handler always receives entire response as parameter, not just the body
                 * - value returned from handler is returned as result of the request
                 * - handler can be async and will be awaited */
                statusCodeHandlers = {},
                /* function: Enables you to monitor download progress. Receives params (percentage, loaded, total)
                 * - CAUTION: This disallows using .json() or .blob() on the body afterwards unless you use XMLHttpRequest.
                 *   A property "stringBody" is available instead. "returnJson" and "returnBlob" will still work. */
                onProgress = null,
                // adds a random number as url param to bypass the browser cache
                addHashToUrl = false
            } = options;

        // read config object
        const fetchConfig = {
            method: 'GET',
            useChaynsAuth: chayns.env.user.isAuthenticated,
            ...config
        };
        const {
            method,
            useChaynsAuth,
            body,
            headers
        } = fetchConfig;

        const jsonBody = body && stringifyBody ? JSON.stringify(body) : null;

        // create request headers
        let requestHeaders = { 'Content-Type': 'application/json' };
        if (useChaynsAuth) requestHeaders.Authorization = `Bearer ${chayns.env.user.tobitAccessToken}`;
        requestHeaders = {
            ...requestHeaders,
            ...headers
        };

        // this way other config elements like "credentials", "mode", "cache" or "signal" can be passed to fetch()
        const remainingFetchConfig = { ...fetchConfig };
        delete remainingFetchConfig.useChaynsAuth;

        let requestAddress = address;
        if (addHashToUrl) {
            requestAddress += `${/\?.+$/.test(address) ? '&' : '?'}${generateUUID().toString().split('-').join('')}`;
        }

        /** REQUEST */
        let response;
        try {
            if (useFetchApi) {
                response = await fetch(requestAddress, {
                    ...remainingFetchConfig,
                    method,
                    headers: new Headers(requestHeaders),
                    body: stringifyBody ? jsonBody : body
                });
            } else {
                response = await (() => new Promise((res, rej) => {
                    const req = new XMLHttpRequest();
                    const headerKeys = Object.keys(requestHeaders);
                    for (let i = 0; i < headerKeys.length; i += 1) {
                        try {
                            req.setRequestHeader(headerKeys[i], requestHeaders[headerKeys[i]]);
                        } catch (ex) {
                            chaynsHelperConfig.getLogger().warning({
                                message: `[HttpRequest] Could not set header ${headerKeys[i]} on ${processName}`,
                                data: {
                                    address,
                                    method,
                                    body,
                                    headers: {
                                        ...requestHeaders,
                                        Authorization: undefined
                                    }
                                },
                                section: 'httpRequest.js'
                            }, ex);
                        }
                    }
                    if (onProgress && types.isFunction(onProgress)) {
                        req.addEventListener('progress', (event) => {
                            if (event.lengthComputable) {
                                onProgress((event.loaded / event.total) * 100, event.loaded, event.total);
                            } else {
                                console.notLive.warn('[HttpRequest] Can\'t monitor progress: length not computable');
                            }
                        });
                    }
                    req.addEventListener('load', (evt) => {
                        res(req);
                    });
                    req.addEventListener('error', (err) => {
                        rej(err);
                    });
                    req.open(method, address);
                    req.send(stringifyBody ? jsonBody : body);
                }))();
            }
        } catch (err) {
            chaynsHelperConfig.getLogger().warning({
                message: `[HttpRequest] Failed to fetch on ${processName}`,
                data: {
                    address,
                    method,
                    body,
                    headers: {
                        ...requestHeaders,
                        Authorization: undefined
                    }
                },
                section: 'httpRequest.js'
            }, err);
            // with the timeout aborted requests (e.g. by reloading) won't open this dialog
            setTimeout(() => {
                chayns.dialog.alert('', 'Verbindung fehlgeschlagen. Versuche es später nochmal.');
            }, 300);
            err.statusCode = -1;
            if (!ignoreErrors) {
                reject(err);
            } else {
                reject();
            }
        }

        const { status } = response;

        /** LOGS */
        const sessionUid = useFetchApi
                           ? response.headers && response.headers.get('X-Request-Id')
                             ? response.headers.get('X-Request-Id') : undefined
                           : response.getAllResponseHeaders && response.getResponseHeader('X-Request-Id')
                             ? response.getResponseHeader('X-Request-Id') : undefined;
        const logData = {
            data: {
                ...additionalLogData,
                address,
                method,
                body,
                headers: {
                    ...requestHeaders,
                    Authorization: undefined
                },
                status,
                sessionUid
            },
            section: 'httpRequest.js',
            sessionUid
        };
        if (response && status < 400) {
            chaynsHelperConfig.getLogger().info({
                ...logData,
                message: `[HttpRequest] http request finished: Status ${status} on ${processName}`
            });
        } else if (response && status === 401) {
            const error = new RequestError(`Status ${status} on ${processName}`, status);
            chaynsHelperConfig.getLogger().warning({
                ...logData,
                message: `[HttpRequest] http request failed: Status ${status} on ${processName}`,
            }, error);
            // eslint-disable-next-line no-console
            console.notLive.error(error);
            if (!ignoreErrors && !ignoreStatusCodes.includes(401)) {
                if (useChaynsAuth && autoRefreshToken) {
                    try {
                        const jRes = await response.json();
                        if (jRes.message === 'token_expired') {
                            resolve(httpRequest(address, config, processName, {
                                ...options,
                                autoRefreshToken: false
                            }));
                        } else {
                            reject(error);
                        }
                    } catch (err) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            } else {
                reject();
            }
        } else {
            const error = new RequestError(`Status ${status} on ${processName}`, status);
            chaynsHelperConfig.getLogger().error({
                ...logData,
                message: `[HttpRequest] http request failed: Status ${status} on ${processName}`
            }, error);
            // eslint-disable-next-line no-console
            console.notLive.error(error);
            if (!ignoreErrors && !ignoreStatusCodes.includes(status)) {
                reject(error);
            } else {
                reject();
            }
        }

        /** RESPONSE HANDLING */
        if (statusCodeHandlers[status] && types.isFunction(statusCodeHandlers[status])) {
            resolve(await statusCodeHandlers[status](response));
        }
        if (!types.isNullOrEmpty(statusCodeHandlers)) {
            const keys = Object.keys(statusCodeHandlers);
            for (let i = 0; i < types.length(keys); i += 1) {
                const regExp = new RegExp(keys[i]);
                if (regExp.test(status?.toString()) && types.isFunction(statusCodeHandlers[keys[i]])) {
                    // eslint-disable-next-line no-await-in-loop
                    resolve(await statusCodeHandlers[keys[i]](response));
                    return;
                }
            }
        }
        if (statusCodeHandlers.codes
            && types.isArray(statusCodeHandlers.codes)
            && statusCodeHandlers.codes.includes(status)
            && types.isFunction(statusCodeHandlers.handler)) {
            resolve(await statusCodeHandlers.handler(response));
        }
        if (onProgress && types.isFunction(onProgress) && useFetchApi) {
            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length');
            let receivedLength = 0; // received that many bytes at the moment
            const chunks = []; // array of received binary chunks (comprises the body)
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
                onProgress((receivedLength / contentLength) * 100, receivedLength, contentLength);
            }
            if (returnBlob) resolve(new Blob(chunks));
            const chunksAll = new Uint8Array(receivedLength);
            let position = 0;
            for (const chunk of chunks) {
                chunksAll.set(chunk, position);
                position += chunk.length;
            }
            const result = new TextDecoder('utf-8').decode(chunksAll);
            if (returnJson) {
                try {
                    resolve(JSON.parse(result));
                } catch (err) {
                    chaynsHelperConfig.getLogger().warning({
                        message: `[HttpRequest] Parsing JSON body failed on Status ${status} on ${processName}`
                    });
                    // eslint-disable-next-line no-console
                    console.notLive.error(
                        `[HttpRequest] Parsing JSON body failed on Status ${status} on ${processName}`
                    );
                    if (status >= 200 && status < 300) {
                        resolve(null);
                    } else if (!ignoreErrors) reject(err); else reject();
                }
            }
            response.bodyString = result;
            resolve(response);
        } else {
            if (returnJson) {
                try {
                    resolve(useFetchApi ? await response.json() : JSON.parse(response.response));
                } catch (err) {
                    chaynsHelperConfig.getLogger().warning({
                        message: `[HttpRequest] Getting JSON body failed on Status ${status} on ${processName}`
                    });
                    // eslint-disable-next-line no-console
                    console.notLive.error(
                        `[HttpRequest] Getting JSON body failed on Status ${status} on ${processName}`
                    );
                    if (status >= 200 && status < 300) {
                        resolve(null);
                    } else if (!ignoreErrors) reject(err); else reject();
                }
            }
            if (returnBlob) {
                try {
                    resolve(await response.blob());
                } catch (err) {
                    chaynsHelperConfig.getLogger().warning({
                        message: `[HttpRequest] Getting BLOB body failed on Status ${status} on ${processName}`
                    });
                    // eslint-disable-next-line no-console
                    console.notLive.error(
                        `[HttpRequest] Getting BLOB body failed on Status ${status} on ${processName}`
                    );
                    if (status >= 200 && status < 300) {
                        resolve(null);
                    } else if (!ignoreErrors) reject(err); else reject();
                }
            }
            resolve(response);
        }
    })();
});

export default httpRequest;
