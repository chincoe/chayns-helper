import generateUUID from '../functions/generateUid';
import { chaynsHelperConfig } from '../chaynsHelperConfig';
import { showWaitCursor } from './waitCursor';
import types from './types';
import localStorage from '../other/localStorageHelper';

/**
 * @type {{Delete: string, Post: string, Get: string, Patch: string, Put: string}}
 */
export const HttpMethod = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Patch: 'PATCH',
    Delete: 'DELETE',
};

/**
 * Custom error for error statusCodes or other errors during a httpRequest
 * @public
 * @class
 */
export class RequestError extends Error {
    /**
     * @param {string} message - Error message
     * @param {number} statusCode - Response status code
     */
    constructor(message, statusCode) {
        super(message);
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
        let hideWaitCursor = () => {};
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
                    reject(err);
                })
                .finally(finallyHandler);
        } catch (err) {
            hideWaitCursor();
            // eslint-disable-next-line no-console
            console.notLive.error(err);
            handleErrors(err);
            reject(err);
        }
    }
);

/**
 * httpRequest response type. Default: json
 * @type
 * @property {string} Response - Get the Response Object
 * @property {string} Blob - Get response.blob()
 * @property {string} Json - Get response.json()
 * @property {Object.<string, *>} Object - Get status and json as Object {status: number, data: Object}
 */
export const ResponseType = {
    Json: 'json',
    Blob: 'blob',
    Response: 'response',
    Object: 'object'
};

/**
 * @typedef objectResponse
 * @property {number} status,
 * @property {Object} data
 */

/**
 * Log Level
 * @type {{critical: string, warning: string, none: string, error: string, info: string}}
 */
export const LogLevel = {
    info: 'info',
    warning: 'warning',
    error: 'error',
    critical: 'critical',
    none: 'none'
};

/**
 * @callback onProgressHandler
 * @param {number} percentage - Percentage of content downloaded
 * @param {number} loaded - Data already loaded
 * @param {number} total - Total data to load
 */
/**
 * @callback statusCodeHandler
 * @param {Response} response - The response of the request
 * @returns {*} result
 */
/**
 * Helper to send httpRequests. Works best if wrapped with handleRequest()
 * @param {string} address - Address of the request
 * @param {Object} [config={}] - Fetch config
 * @param {HttpMethod|string} [config.method='GET'] - HttpMethod
 * @param {Object} [config.headers] - Additional HttpHeaders
 * @param {boolean} [config.useChaynsAuth] - Add user token as authorization if available
 * @param {*} [config.body] - Body of the request
 * @param {*} [config.signal] - Signal to abort request while running, use with RTK thunks
 * @param {string} [processName='HttpRequest'] - Name of the process in the logs
 * @param {Object} [options={}] - Additional options for the request
 * @param {ResponseType|string} [options.responseType=null] - type of response that is expected
 * @param {boolean|number[]} [options.ignoreErrors=false] - Don't throw errors for this request if true or if this
 *     array contains the response status. Return null on error instead. Errors will still be logged as usual.
 * @param {boolean} [options.useFetchApi=true] - use fetch(), use XMLHttpRequest otherwise
 * @param {Object.<string,LogLevel>} [options.logConfig={}] - Define the logLevel for these status codes. Can use
 *     status code or regex string as key. Values must be info|warning|error|critical|none.
 * @param {boolean} [options.stringifyBody=true] - Call JSON.stringify(body) for the body passed to this function
 * @param {Object} [options.additionalLogData={}] - Additional data to be logged with this request
 * @param {boolean} [options.autoRefreshToken=true] - Automatically try to refresh the token once if it expired
 * @param {Object} [options.statusHandlers={}] - Handle response for specific success status codes
 * Usage: { [statusCode|regexString] : (response) => { my code }, ... }
 *     - handler always receives entire response as parameter, not just the body
 *     - value returned from handler is returned as result of the request
 *     - handler can be async and will be awaited
 *     Response handling priorities:
 *      1. statusHandlers[status]
 *      2. statusHandlers[regex]
 *      3. response type
 * @param {statusCodeHandler} [options.statusHandlers.200]
 * @param {statusCodeHandler} [options.statusHandlers.201]
 * @param {statusCodeHandler} [options.statusHandlers.204]
 * @param {statusCodeHandler} [options.statusHandlers.304]
 * @param {statusCodeHandler} [options.statusHandlers.400]
 * @param {statusCodeHandler} [options.statusHandlers.401]
 * @param {statusCodeHandler} [options.statusHandlers.403]
 * @param {statusCodeHandler} [options.statusHandlers.404]
 * @param {statusCodeHandler} [options.statusHandlers.500]
 * @param {statusCodeHandler} [options.statusHandlers.503]
 * @param {onProgressHandler} [options.onProgress=null] - Gets called multiple times during the download of bigger data,
 *     e.g. for progress bars. Prevents the use of .json() and .blob() if useFetchApi is true. A param "stringBody" is
 *     added to read the body instead. Response types other than 'response' will work as usual.
 * @param {boolean} [options.addHashToUrl=false] - Add a random hash as URL param to bypass the browser cache
 *
 * @async
 * @public
 * @return {Promise<Response|objectResponse|Blob|Object>} - response or response body
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
                /**
                 * ResponseType, Default: json
                 * @type {ResponseType|string|null}
                 */
                responseType = null,
                /**
                 * log level config of each status code
                 * Defaults: status<400 : info, status=401: warning, else: error
                 * @type {Object.<string|RegExp,LogLevel|string>}
                 */
                logConfig = {},
                // bool|number[]: don't throw errors on error status codes, return null instead
                ignoreErrors = false,
                // bool: use fetch(), use XMLHttpRequest otherwise
                useFetchApi = true,
                // bool: call JSON.stringify() on the body passed to this function
                stringifyBody = true,
                // object: additional data to be logged
                additionalLogData = {},
                // bool: automatically try to refresh the token once if it is expired
                autoRefreshToken = true,
                /*
                 * SUCCESS STATUS CODES ONLY
                 * Execute these callbacks on specific status codes. Format:
                 * 1. { [statusCodeOrRegexString] : (response) => { my code }, ... }
                 * 2. { codes: [...statusCodeArray], handler: (response) => { my code } }
                 * - handler always receives entire response as parameter, not just the body
                 * - value returned from handler is returned as result of the request
                 * - handler can be async and will be awaited
                 */
                statusHandlers = {},
                /* function: Enables you to monitor download progress. Receives params (percentage, loaded, total)
                 * - CAUTION: This disallows using .json() or .blob() on the body afterwards unless you use XMLHttpRequest.
                 *   A property "stringBody" is available instead. "returnJson" and "returnBlob" will still work. */
                /**
                 * @type {onProgressHandler}
                 */
                onProgress = null,
                // adds a random number as url param to bypass the browser cache
                addHashToUrl = false
            } = options;

        if (responseType != null && !Object.values(ResponseType).includes(responseType)) {
            console.error(`[HttpRequest] Response type ${responseType} is not valid. Use json|blob|response|object instead.`);
            return;
        }

        // read config object
        const fetchConfig = {
            method: HttpMethod.Get,
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

        const tryReject = (err = null, status = null) => {
            if (ignoreErrors === true) {
                resolve(null);
            } else if (status && types.isArray(ignoreErrors) && ignoreErrors.includes(status)) {
                resolve(null);
            } else {
                reject(err);
            }
        };

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
                    additionalLogData,
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
            tryReject(err);
        }

        const { status } = response;

        const log = (() => {
            const logger = chaynsHelperConfig.getLogger();
            const levelKey = Object.keys(logConfig)
                .find(key => (/^[\d]$/.test(key) && parseInt(key, 10) === status)
                    || new RegExp(key).test(status));
            if (levelKey && logConfig[levelKey]) {
                switch (logConfig[levelKey]) {
                    case LogLevel.info:
                        return logger.info;
                    case LogLevel.warning:
                        return logger.warning;
                    case LogLevel.error:
                        return logger.error;
                    case LogLevel.critical:
                        return logger.critical;
                    case LogLevel.none:
                        return console.error;
                    default:
                        console.error(`[HttpRequest] LogLevel ${logConfig[levelKey]} for ${levelKey} is not valid. Please use a valid log level.`);
                        return logger.warning;
                }
            } else {
                if (status < 400) return logger.info;
                if (status === 401) return logger.warning;
                return logger.error;
            }
        })();

        /** LOGS */
        const sessionUid = useFetchApi
                           ? response.headers && response.headers.get('X-Request-Id')
                             ? response.headers.get('X-Request-Id') : undefined
                           : response.getAllResponseHeaders && response.getResponseHeader('X-Request-Id')
                             ? response.getResponseHeader('X-Request-Id') : undefined;
        const logData = {
            data: {
                additionalLogData,
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
            log({
                ...logData,
                message: `[HttpRequest] http request finished: Status ${status} on ${processName}`
            });
        } else if (response && status === 401) {
            const error = new RequestError(`Status ${status} on ${processName}`, status);
            log.warning({
                ...logData,
                message: `[HttpRequest] http request failed: Status ${status} on ${processName}`,
            }, error);
            // eslint-disable-next-line no-console
            console.notLive.error(error);
            if (!ignoreErrors && useChaynsAuth && autoRefreshToken) {
                try {
                    const jRes = await response.json();
                    if (jRes.message === 'token_expired') {
                        resolve(httpRequest(address, config, processName, {
                            ...options,
                            autoRefreshToken: false
                        }));
                    } else {
                        tryReject(error, status);
                    }
                } catch (err) { tryReject(error, status); }
            } else {
                tryReject(error, status);
            }
        } else {
            const error = new RequestError(`Status ${status} on ${processName}`, status);
            log({
                ...logData,
                message: `[HttpRequest] http request failed: Status ${status} on ${processName}`
            }, error);
            // eslint-disable-next-line no-console
            console.notLive.error(error);
            tryReject(error, status);
        }

        /** RESPONSE HANDLING */
        /*
         * Response handling priorities:
         * 1. statusHandlers[status]
         * 2. statusHandlers[regex]
         * 3. response type
         */

        if (statusHandlers[status] && types.isFunction(statusHandlers[status])) {
            resolve(await statusHandlers[status](response));
        }
        if (!types.isNullOrEmpty(statusHandlers)) {
            const keys = Object.keys(statusHandlers);
            for (let i = 0; i < types.length(keys); i += 1) {
                const regExp = new RegExp(keys[i]);
                if (regExp.test(status?.toString()) && types.isFunction(statusHandlers[keys[i]])) {
                    // eslint-disable-next-line no-await-in-loop
                    resolve(await statusHandlers[keys[i]](response));
                    return;
                }
            }
        }
        if (onProgress && types.isFunction(onProgress) && useFetchApi) {
            const responseClone = response.clone();
            const reader = responseClone.body.getReader();
            const contentLength = +responseClone.headers.get('Content-Length');
            let receivedLength = 0; // received that many bytes at the moment
            const chunks = []; // array of received binary chunks (comprises the body)
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
                onProgress((receivedLength / contentLength) * 100, receivedLength, contentLength);
            }
            if (responseType === ResponseType.Blob) resolve(new Blob(chunks));
            const chunksAll = new Uint8Array(receivedLength);
            let position = 0;
            for (const chunk of chunks) {
                chunksAll.set(chunk, position);
                position += chunk.length;
            }
            const result = new TextDecoder('utf-8').decode(chunksAll);
            if (responseType === ResponseType.Json || responseType === null) {
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
                    } else {
                        tryReject(null, status);
                    }
                }
            }
            if (responseType === ResponseType.Object) {
                resolve({ status, data: JSON.parse(result) });
            }
            if (responseType === ResponseType.Response) {
                response.bodyString = result;
                resolve(response);
            }
        } else {
            if (responseType === null || responseType === ResponseType.Json) {
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
                    } else {
                        tryReject(null, status);
                    }
                }
            }
            if (responseType === ResponseType.Blob) {
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
                    } else {
                        tryReject(null, status);
                    }
                }
            }
            if (responseType === ResponseType.Object) {
                try {
                    resolve({ status, data: useFetchApi ? await response.json() : JSON.parse(response.response) });
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
                    } else {
                        tryReject(null, status);
                    }
                }
            }
            if (responseType === ResponseType.Response) {
                resolve(response);
            }
        }
    })();
});

export default httpRequest;
