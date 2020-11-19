import { isNullOrWhiteSpace } from 'chayns-components/lib/utils/is';
import logger from 'chayns-logger';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import colorLog from '../../utils/colorLog';
import generateUUID from '../generateUid';
import stringToRegex, { regexRegex } from '../../utils/stringToRegex';
import ChaynsError from './ChaynsError';
import HttpMethod from './HttpMethod';
import {
    blobResolve,
    jsonResolve,
    objectResolve,
    textResolve,
    mergeOptions,
    getMapKeys,
    getLogFunctionByStatus,
    getStatusHandlerByStatusRegex,
    resolveWithHandler
} from './httpRequestUtils';
import { chaynsErrorCodeRegex } from './isChaynsError';
import RequestError from './RequestError';
import ResponseType from './ResponseType';
import LogLevel from './LogLevel';
import handleRequest from './handleRequest';
import setRequestDefaults, { defaultConfig } from './setRequestDefaults';

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
 * @param {string} [config.cache]
 * @param {string} [config.referrer]
 * @param {string} [config.referrerPolicy]
 * @param {string} [config.mode]
 * @param {string} [config.redirect]
 * @param {string} [config.integrity]
 * @param {boolean} [config.keepalive]
 * @param {Window} [config.window]
 * @param {AbortSignal} [config.signal] - Signal to abort request while running, use with RTK thunks
 * @param {string} [processName='HttpRequest'] - Name of the process in the logs
 * @param {Object} [options={}] - Additional options for the request
 * @param {ResponseType|string} [options.responseType=null] - type of response that is expected
 * @param {boolean|number[]} [options.ignoreErrors=false] - Don't throw errors for this request if true or if this
 *     array contains the response status. Return null on error instead. Errors will still be logged as usual.
 * @param {Object.<string,LogLevel>} [options.logConfig={}] - Define the logLevel for these status codes. Can use
 *     status code or regex string as key. Values must be info|warning|error|critical|none.
 * @param {boolean} [options.stringifyBody=true] - Call JSON.stringify(body) for the body passed to this function
 * @param {Object} [options.additionalLogData={}] - Additional data to be logged with this request
 * @param {boolean} [options.autoRefreshToken=true] - Automatically try to refresh the token once if it expired
 * @param {Object} [options.statusHandlers={}] - Handle response for specific status codes
 * Usage: { [statusCode|regexString] : (response) => { my code }, ... }
 *    OR: { [statusCode|regexString] : responseType }
 *     - handler always receives entire response as parameter, not just the body
 *     - value returned from handler is returned as result of the request
 *     - handler can be async and will be awaited
 *     Response handling priorities:
 *      1. statusHandlers[status]
 *      2. statusHandlers[regex]
 *      3. response type
 * @param {Object.<string|RegExp, ResponseType|statusCodeHandler|function(Response)>} [options.errorHandlers={}] -
 *     chayns error handler for specific ChaynsErrors
 * @param {Object.<string|RegExp, string|function>} [options.replacements={}] - replacements for request url
 * @async
 * @public
 * @throws {RequestError}
 * @return {Promise<Response|objectResponse|Blob|Object>} - response or response body
 */
export function httpRequest(
    // full request address. URLs should be defined as functions or constants in a separate file
    address,
    // fetch config
    config,
    // processName for logs
    processName,
    // options for this helper
    options,
) {
    return new Promise((globalResolve, reject) => {
        (async () => {
            /** INPUT HANDLING */
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
                // logConfig = {},
                // bool|number[]: don't throw errors on error status codes, return null instead
                ignoreErrors = false,
                // bool: call JSON.stringify() on the body passed to this function
                stringifyBody = true,
                // object: additional data to be logged
                additionalLogData = {},
                // bool: automatically try to refresh the token once if it is expired
                autoRefreshToken = true,
                /*
                 * Handle responses for specific status codes manually. Format:
                 * 1. { [statusCodeOrRegexString] : (response) => { my code }, ... }
                 * 2. { [statusCodeOrRegexString] : responseType, ... }
                 * - handler always receives entire response as parameter, not just the body
                 * - value returned from handler is returned as result of the request
                 * - handler can be async and will be awaited
                 * => Use this to get jsonBody on error status codes or .json() on 204
                 */
                // statusHandlers = {},
                internalRequestGuid = generateUUID(),
                replacements = {}
            } = {
                responseType: ResponseType.Json,
                // logConfig: {},
                ignoreErrors: false,
                stringifyBody: true,
                additionalLogData: {},
                autoRefreshToken: true,
                // statusHandlers: {},
                replacements: {
                    [/##locationId##/g]: chayns.env.site.locationId,
                    [/##siteId##/g]: chayns.env.site.id,
                    [/##tappId##/g]: chayns.env.site.tapp.id,
                    [/##userId##/g]: chayns.env.user.id,
                    [/##personId##/g]: chayns.env.user.personId
                },
                ...(defaultConfig.options || {}),
                ...(options || {})
            };

            const input = {
                address,
                config,
                options
            };

            // properly merge the status handlers and log config of options and default options. The function returns a
            // map to have a reliable key order to ensure that all options have a higher priority than default options
            const statusHandlers = mergeOptions(
                (options?.statusHandlers || {}),
                (defaultConfig?.options?.statusHandlers || {})
            );
            const errorHandlers = mergeOptions(
                (options?.errorHandlers || {}),
                (defaultConfig?.options?.errorHandlers || {})
            );
            const logConfig = mergeOptions((options?.logConfig || {}), (defaultConfig?.options?.logConfig || {}));

            // eslint-disable-next-line no-param-reassign
            if (!processName) processName = 'HttpRequest';
            if (responseType != null && !Object.values(ResponseType)
                .includes(responseType)) {
                console.error(
                    ...colorLog({
                        '[HttpRequest]': 'color: #aaaaaa',
                        // eslint-disable-next-line max-len
                        [`Response type "${responseType}" is not valid. Use json|blob|response|object|none instead.`]: ''
                    })
                );
                reject(new Error('Invalid responseType'));
                return;
            }

            // read config object
            const fetchConfig = {
                method: HttpMethod.Get,
                useChaynsAuth: chayns.env.user.isAuthenticated,
                ...(defaultConfig.config || {}),
                ...(config || {})
            };
            const {
                method,
                useChaynsAuth,
                body,
                headers
            } = fetchConfig;

            const jsonBody = body && stringifyBody ? JSON.stringify(body) : null;

            // create request headers
            let requestHeaders = stringifyBody ? { 'Content-Type': 'application/json' } : {};
            if (useChaynsAuth) requestHeaders.Authorization = `Bearer ${chayns.env.user.tobitAccessToken}`;
            requestHeaders = {
                ...requestHeaders,
                ...(defaultConfig?.config?.headers || {}),
                ...headers
            };

            // this way other config elements like "credentials", "mode", "cache" or "signal" can be passed to fetch()
            const remainingFetchConfig = { ...fetchConfig };
            delete remainingFetchConfig.useChaynsAuth;

            let requestAddress = '';
            if (!isNullOrWhiteSpace(defaultConfig.address)
                && !/^.+?:\/\//.test(address)
                && /^.+?:\/\//.test(defaultConfig.address)
                && /^\//.test(address)) {
                requestAddress = `${defaultConfig.address}${address}`;
            } else {
                requestAddress = address;
            }
            if (replacements && chayns.utils.isObject(replacements)) {
                const replacementKeys = Object.keys(replacements);
                for (let i = 0; i < replacementKeys.length; i++) {
                    if (regexRegex.test(replacementKeys[i])) {
                        const regex = stringToRegex(replacementKeys[i]);
                        requestAddress = requestAddress.replace(regex, replacements[replacementKeys[i]]);
                    } else {
                        requestAddress = requestAddress.replaceAll(
                            replacementKeys[i],
                            replacements[replacementKeys[i]]
                        );
                    }
                }
            }

            const resolve = (value) => {
                globalResolve(value);
                logger.info({
                    message: `[HttpRequest] ${processName} resolved`,
                    data: {
                        resolveValue: value,
                        internalRequestGuid
                    }
                });
            };

            /**
             * @param {Error|RequestError|ChaynsError} err
             * @param {?number} status
             * @param {boolean} force
             *
             * @returns {boolean}
             */
            const tryReject = async (
                err = null,
                status = null,
                force = false
            ) => {
                const handlerKeys = getMapKeys(statusHandlers);
                const statusHandlerKey = handlerKeys.find((k) => k === `${status}` || stringToRegex(k)
                    .test(`${status}`));
                const errorKeys = getMapKeys(errorHandlers);

                // handle chaynsErrorHandler
                const isChayns = err instanceof ChaynsError;
                const chaynsErrorCode = isChayns ? err?.errorCode : null;
                const errorHandlerKey = errorKeys.find((k) => (isChayns
                    && (k === chaynsErrorCode || stringToRegex(k).test(chaynsErrorCode))));
                if (isChayns && errorHandlerKey) {
                    const handler = errorHandlers.get(errorHandlerKey);
                    if (handler === ResponseType.Error) {
                        reject(err);
                    }
                    if (!force) return false;
                }

                // handle statusCode handler
                if (statusHandlerKey && statusHandlers.get(statusHandlerKey) !== ResponseType.Error
                    && (!force || status === 1)) {
                    if (status === 1) {
                        const handler = statusHandlers.get(statusHandlerKey);
                        if (chayns.utils.isFunction(handler)) {
                            resolve(await handler(err));
                            return true;
                        }
                        if (Object.values(ResponseType).includes(handler)) {
                            switch (handler) {
                                case ResponseType.Object:
                                    resolve({
                                        status,
                                        data: null
                                    });
                                    return true;
                                case ResponseType.Response:
                                    resolve({ status });
                                    return true;
                                default:
                                    resolve(null);
                                    return true;
                            }
                        }
                    }
                    return false;
                }
                if (statusHandlers.has(`${status}`)
                    && statusHandlers.get(`${status}`) === ResponseType.Error) {
                    console.error(...colorLog({
                        '[HttpRequest]': 'color: #aaaaaa',
                        'ResponseType \'error\':': ''
                    }), err, '\nInput: ', input);
                    reject(err);
                    return true;
                }
                if (ignoreErrors === true
                    || (status && chayns.utils.isArray(ignoreErrors)
                        && ignoreErrors.includes(status))
                ) {
                    if (chayns.utils.isNumber(status)) {
                        switch (responseType) {
                            case ResponseType.Object:
                                resolve({
                                    status,
                                    data: null
                                });
                                return true;
                            case ResponseType.None:
                                resolve();
                                return true;
                            case ResponseType.Error:
                                const error = new RequestError(`Status ${status} on ${processName}`, status);
                                console.error(...colorLog({
                                    '[HttpRequest]': 'color: #aaaaaa',
                                    'ResponseType \'error\':': ''
                                }), error, '\nInput: ', input);
                                reject(error);
                                return true;
                            case ResponseType.Response:
                                resolve({ status });
                                return true;
                            case ResponseType.Text:
                            case ResponseType.Blob:
                            case ResponseType.Json:
                            default:
                                resolve(null);
                                return true;
                        }
                    }
                    resolve(null);
                    return true;
                }
                reject(err);
                return true;
            };

            const fetchStartTime = Date.now();

            /** REQUEST */
            let response;
            try {
                response = await fetch(requestAddress, {
                    ...remainingFetchConfig,
                    method,
                    headers: new Headers(requestHeaders),
                    body: stringifyBody ? jsonBody : body
                });
                if (!response) {
                    throw new RequestError(
                        `[HttpRequest] Failed to fetch on ${processName}: Response is not defined`,
                        1
                    );
                }
            } catch (err) {
                const failedToFetchLog = await getLogFunctionByStatus(1, logConfig, logger.warning);
                failedToFetchLog({
                    message: `[HttpRequest] Failed to fetch on ${processName}`,
                    data: {
                        address: requestAddress,
                        method,
                        body,
                        additionalLogData,
                        headers: {
                            ...requestHeaders,
                            Authorization: undefined
                        },
                        online: `${navigator?.onLine}, ${navigator?.connection?.effectiveType}`,
                        processName,
                        requestDuration: `${Date.now() - fetchStartTime} ms`,
                        requestTime: new Date(fetchStartTime).toISOString(),
                        internalRequestGuid
                    },
                    section: 'httpRequest.js'
                }, err);
                console.error(...colorLog({
                    '[HttpRequest]': 'color: #aaaaaa',
                    // eslint-disable-next-line max-len
                    [`(${processName}) Failed to fetch: `]: '',
                }), err, '\nInput: ', input);
                err.statusCode = 1;
                tryReject(err, 1, true);
                return;
            }

            const { status } = response;

            /** LOGS */
            const requestUid = response.headers && response.headers.get('X-Request-Id')
                               ? response.headers.get('X-Request-Id') : undefined;

            let responseBody = null;
            try {
                const resClone = response.clone();
                try {
                    responseBody = await resClone.json();
                } catch (e) {
                    responseBody = await resClone.text();
                }
            } catch (e) {
                // ignored
            }

            const logData = {
                data: {
                    processName,
                    request: {
                        address: requestAddress,
                        method,
                        body,
                        headers: {
                            ...requestHeaders,
                            Authorization: requestHeaders?.Authorization
                                           && chayns.utils.isJwt(requestHeaders?.Authorization)
                                           ? `Payload: ${requestHeaders.Authorization.split('.')[1]}`
                                           : undefined
                        },
                    },
                    response: {
                        status,
                        requestUid,
                        body: responseBody,
                    },
                    input,
                    online: `${navigator?.onLine}, ${navigator?.connection?.effectiveType}`,
                    requestDuration: `${Date.now() - fetchStartTime} ms`,
                    requestTime: new Date(fetchStartTime).toISOString(),
                    internalRequestGuid,
                    additionalLogData: additionalLogData === {} ? undefined : additionalLogData
                },
                section: 'httpRequest.js',
                req_guid: requestUid
            };

            let defaultLog = logger.error;
            if (status < 400) defaultLog = logger.info;
            if (status === 401) defaultLog = logger.warning;
            const log = await getLogFunctionByStatus(status, logConfig, defaultLog, responseBody);

            const chaynsErrorObject = await ChaynsError.getChaynsErrorObject(responseBody);

            if (response && status < 400) {
                log({
                    ...logData,
                    message: `[HttpRequest] http request finished: Status ${status} on ${processName}`
                });
            } else if (response && status === 401) {
                const error = chaynsErrorObject
                              ? new ChaynsError(chaynsErrorObject, processName, status)
                              : new RequestError(`Status ${status} on ${processName}`, status);
                log({
                    ...logData,
                    message: `[HttpRequest] http request failed: Status ${status} on ${processName}`,
                }, error);
                // eslint-disable-next-line no-console
                console.error(...colorLog({
                    '[HttpRequest]': 'color: #aaaaaa',
                    [`(${processName})`]: ''
                }), error, '\nInput: ', input);
                if (!ignoreErrors && useChaynsAuth && autoRefreshToken) {
                    try {
                        const jRes = await response.json();
                        if (jRes.message === 'token_expired') {
                            resolve(httpRequest(address, config, processName, {
                                responseType,
                                logConfig,
                                ignoreErrors,
                                stringifyBody,
                                additionalLogData,
                                autoRefreshToken: false,
                                statusHandlers,
                                errorHandlers,
                                internalRequestGuid
                            }));
                        } else { tryReject(error, status, false); }
                    } catch (err) { tryReject(error, status, false); }
                } else { tryReject(error, status, false); }
            } else {
                const error = chaynsErrorObject
                              ? new ChaynsError(chaynsErrorObject, processName, status)
                              : new RequestError(`Status ${status} on ${processName}`, status);
                log({
                    ...logData,
                    message: `[HttpRequest] http request failed: Status ${status} on ${processName}`
                }, error);
                // eslint-disable-next-line no-console
                console.error(...colorLog({
                    '[HttpRequest]': 'color: #aaaaaa',
                    [`(${processName})`]: '',
                }), error, '\nInput: ', input);
                tryReject(error, status, false);
            }

            /** RESPONSE HANDLING */
            /*
             * Response handling priorities:
             * 1. errorHandlers
             *     1.1 errorHandlers[chaynsErrorCode]
             *     1.2 errorHandlers[chaynsErrorRegex]
             * 2. statusHandlers
             *     2.1 statusHandlers[status]
             *     2.2 statusHandlers[regex]
             * 3. response type
             * 4. default: Response
             */

            const errorCode = chaynsErrorObject?.errorCode;
            // 1. error handlers
            if (errorCode) {
                // 1.1 errorHandlers[chaynsErrorCode]
                if (errorHandlers.has(errorCode)) {
                    const handler = errorHandlers.get(errorCode);
                    const result = await resolveWithHandler(
                        handler,
                        response,
                        status,
                        processName,
                        resolve,
                        reject,
                        internalRequestGuid,
                        chaynsErrorObject
                    );
                    if (result) return;
                }
                // 1.2 errorHandlers[chaynsErrorRegex]
                if (errorHandlers && errorHandlers.size > 0) {
                    const errorKeys = getMapKeys(errorHandlers);
                    const key = errorKeys.find((k) => (
                        chaynsErrorCodeRegex.test(k)
                        && stringToRegex(key).test(errorCode)
                    ));
                    const handler = errorHandlers.get(key);
                    if (handler) {
                        const result = await resolveWithHandler(
                            handler,
                            response,
                            status,
                            processName,
                            resolve,
                            reject,
                            internalRequestGuid,
                            chaynsErrorObject
                        );
                        if (result) return;
                    }
                }
            }

            // 2.1 statusHandlers[status]
            if (statusHandlers && statusHandlers.has(`${status}`)) {
                const handler = statusHandlers.get(`${status}`);
                const result = await resolveWithHandler(
                    handler,
                    response,
                    status,
                    processName,
                    resolve,
                    reject,
                    internalRequestGuid
                );
                if (result) return;
            }
            // 2.2 statusHandlers[regex]
            if (statusHandlers && statusHandlers.size > 0) {
                const handler = getStatusHandlerByStatusRegex(status, statusHandlers);
                if (handler) {
                    const result = await resolveWithHandler(
                        handler,
                        response,
                        status,
                        processName,
                        resolve,
                        reject,
                        internalRequestGuid
                    );
                    if (result) return;
                }
            }

            // 3. responseType
            if (responseType === null || responseType === ResponseType.Json) {
                await jsonResolve(response, processName, resolve, internalRequestGuid);
            } else if (responseType === ResponseType.Blob) {
                await blobResolve(response, processName, resolve, internalRequestGuid);
            } else if (responseType === ResponseType.Object) {
                await objectResolve(response, processName, resolve, internalRequestGuid);
            } else if (responseType === ResponseType.Text) {
                await textResolve(response, processName, resolve, internalRequestGuid);
            } else if (responseType === ResponseType.None) {
                resolve(null);
            } else if (responseType === ResponseType.Response) {
                resolve(response);
            } else {
                // 4. default
                resolve(response);
            }
        })();
    });
}

/**
 * Combine fetch and handle request
 * @param {string} address - Address of the request
 * @param {Object} [config={}] - Fetch config
 * @param {HttpMethod|string} [config.method='GET'] - HttpMethod
 * @param {Object} [config.headers] - Additional HttpHeaders
 * @param {boolean} [config.useChaynsAuth] - Add user token as authorization if available
 * @param {*} [config.body] - Body of the request
 * @param {string} [config.cache]
 * @param {string} [config.referrer]
 * @param {string} [config.referrerPolicy]
 * @param {string} [config.mode]
 * @param {string} [config.redirect]
 * @param {string} [config.integrity]
 * @param {boolean} [config.keepalive]
 * @param {Window} [config.window]
 * @param {*} [config.signal] - Signal to abort request while running, use with RTK thunks
 * @param {string} [processName='HttpRequest'] - Name of the process in the logs
 * @param {Object} [options={}] - Additional options for the request
 * @param {ResponseType|string} [options.responseType=null] - type of response that is expected
 * @param {boolean|number[]} [options.ignoreErrors=false] - Don't throw errors for this request if true or if this
 *     array contains the response status. Return null on error instead. Errors will still be logged as usual.
 * @param {Object.<string,LogLevel>} [options.logConfig={}] - Define the logLevel for these status codes. Can use
 *     status code or regex string as key. Values must be info|warning|error|critical|none.
 * @param {boolean} [options.stringifyBody=true] - Call JSON.stringify(body) for the body passed to this function
 * @param {Object} [options.additionalLogData={}] - Additional data to be logged with this request
 * @param {boolean} [options.autoRefreshToken=true] - Automatically try to refresh the token once if it expired
 * @param {Object} [options.statusHandlers={}] - Handle response for specific status codes
 * Usage: { [statusCode|regexString] : (response) => { my code }, ... }
 *    OR: { [statusCode|regexString] : responseType }
 *     - handler always receives entire response as parameter, not just the body
 *     - value returned from handler is returned as result of the request
 *     - handler can be async and will be awaited
 *     Response handling priorities:
 *      1. statusHandlers[status]
 *      2. statusHandlers[regex]
 *      3. response type
 * @param {Object.<string|RegExp, ResponseType|statusCodeHandler|function(Response)>} [options.errorHandlers={}] -
 *     chayns error handler for specific ChaynsErrors
 * @param {Object.<string|RegExp, string|function>} [options.replacements={}] - replacements for request url
 *
 * @param {requestErrorHandler} [errorHandler=undefined] - Function to handle error statusCodes. Defaults to
 *     defaultErrorHandler.js
 * @param {Object} [handlerOptions={}] - other options for this wrapper
 * @param {function} [handlerOptions.finallyHandler] - Function that should always be executed after the request
 * @param {boolean|waitCursorOptions} [handlerOptions.waitCursor] - Show chayns waitCursor. Set true to show. Set to an
 *     object for more options
 * @param {string} [handlerOptions.waitCursor.text=undefined] - Text to be displayed after the textTimeout
 * @param {number} [handlerOptions.waitCursor.textTimeout=5000] - Timeout after which the text appears in the wait
 *     cursor
 * @param {number} [handlerOptions.waitCursor.timeout=300] - Timeout after which the waitCursor is displayed
 * @param {string|cacheOptions} [handlerOptions.cache]  (optional) string/object: Set to a string to cache the request
 *     in local storage. Only works if the request returns appropriate data, e.g. a string OR if a cacheResolver is
 *     defined. Set to an object for more detailed cache control.
 * @param {string} handlerOptions.cache.key - The name used to cache this asset in local storage
 * @param {number} [handlerOptions.cache.duration=5] - The duration in minutes after which the cache will be refreshed
 * @param {cacheResolverCallback} [handlerOptions.cache.cacheResolver] - Function to transform the cache content before
 *     setting, e.g. reading a request body
 * @param {boolean} [handlerOptions.noReject=false] - Do not reject promise on error, resolve with null instead
 *
 * @public
 * @async
 * @throws {RequestError}
 * @return result {Promise<*>}
 */
function fullRequest(address, config, processName, options, errorHandler, handlerOptions) {
    return handleRequest(httpRequest(
        address,
        config,
        processName,
        options
    ), errorHandler, handlerOptions);
}

const request = {
    fetch: httpRequest,
    handle: handleRequest,
    error: RequestError,
    responseType: ResponseType,
    logLevel: LogLevel,
    method: HttpMethod,
    defaults: setRequestDefaults,
    full: fullRequest
};

export default request;
