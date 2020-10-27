import { isNullOrWhiteSpace } from 'chayns-components/lib/utils/is';
import logger from 'chayns-logger';
import colorLog from '../../_internal/colorLog';
import generateUUID from '../generateUid';
import stringToRegex, { regexRegex } from '../../_internal/stringToRegex';
import HttpMethod from './HttpMethod';
import {
    blobResolve,
    jsonResolve,
    objectResolve,
    textResolve,
    mergeOptions,
    getMapKeys, getLogFunctionByStatus
} from './httpRequestUtils';
import RequestError from './RequestError';
import requestPresets from './requestPresets';
import ResponseType from './ResponseType';
import LogLevel from './LogLevel';
import handleRequest from './handleRequest';
import setRequestDefaults, { defaultConfig } from './setRequestDefaults';

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
 * @param {boolean} [options.useFetchApi=true] - use fetch(), use XMLHttpRequest otherwise
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
 * @param {onProgressHandler} [options.onProgress=null] - Gets called multiple times during the download of bigger data,
 *     e.g. for progress bars. Prevents the use of .json() and .blob() if useFetchApi is true. A param "stringBody" is
 *     added to read the body instead. Response types other than 'response' will work as usual.
 * @param {boolean} [options.addHashToUrl=false] - Add a random hash as URL param to bypass the browser cache
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
                // bool: use fetch(), use XMLHttpRequest otherwise
                useFetchApi = true,
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
                 * => Use this to get jsonBody on error status codes or prefen .json() on 204
                 */
                // statusHandlers = {},
                /* function: Enables you to monitor download progress. Receives params (percentage, loaded, total)
                 * - CAUTION: This disallows using .json() or .blob() on the body unless you use XMLHttpRequest.
                 *   A property "stringBody" is available instead. responseTypes other than "response" will still work.
                 */
                onProgress = null,
                // adds a random number as url param to bypass the browser cache
                addHashToUrl = false,
                internalRequestGuid = generateUUID(),
                replacements = {}
            } = {
                responseType: ResponseType.Json,
                // logConfig: {},
                ignoreErrors: false,
                useFetchApi: true,
                stringifyBody: true,
                additionalLogData: {},
                autoRefreshToken: true,
                // statusHandlers: {},
                onProgress: null,
                addHashToUrl: false,
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
            if (addHashToUrl) {
                requestAddress += `${/\?.+$/.test(address) ? '&' : '?'}${generateUUID()
                    .toString()
                    .split('-')
                    .join('')}`;
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
             * @param {Error|RequestError} err
             * @param {?number} status
             * @param {boolean} force
             */
            const tryReject = async (err = null, status = null, force = false) => {
                const handlerKeys = getMapKeys(statusHandlers);
                const statusHandlerKey = handlerKeys.find((k) => k === `${status}` || stringToRegex(k)
                    .test(`${status}`));
                if (statusHandlerKey && statusHandlers.get(statusHandlerKey) !== ResponseType.Error
                    && (!force || status === 1)) {
                    if (status === 1) {
                        const handler = statusHandlers.get(statusHandlerKey);
                        if (chayns.utils.isFunction(handler)) {
                            resolve(await handler(err));
                            return;
                        }
                        if (Object.values(ResponseType).includes(handler)) {
                            switch (handler) {
                                case ResponseType.Object:
                                    resolve({
                                        status,
                                        data: null
                                    });
                                    return;
                                case ResponseType.Response:
                                    resolve({ status });
                                    return;
                                default:
                                    resolve(null);
                                    return;
                            }
                        }
                    }
                    return;
                }
                if (statusHandlers.has(`${status}`)
                    && statusHandlers.get(`${status}`) === ResponseType.Error) {
                    reject(err);
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
                                return;
                            case ResponseType.None:
                                resolve();
                                return;
                            case ResponseType.Error:
                                reject(new RequestError(`Status ${status} on ${processName}`, status));
                                return;
                            case ResponseType.Response:
                                resolve({ status });
                                return;
                            case ResponseType.Text:
                            case ResponseType.Blob:
                            case ResponseType.Json:
                            default:
                                resolve(null);
                                return;
                        }
                    }
                    resolve(null);
                } else {
                    reject(err);
                }
            };

            const fetchStartTime = Date.now();

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
                                // eslint-disable-next-line no-console
                                console.warn(
                                    ...colorLog({
                                        '[HttpRequest]': 'color: #aaaaaa',
                                        // eslint-disable-next-line max-len
                                        [`Could not set header ${headerKeys[i]} on ${processName} to ${requestHeaders[headerKeys[i]]}`]: ''
                                    })
                                );
                                logger.warning({
                                    message: `[HttpRequest] Could not set header ${headerKeys[i]} on ${processName}`,
                                    data: {
                                        address,
                                        method,
                                        body,
                                        headers: {
                                            ...requestHeaders,
                                            Authorization: undefined
                                        },
                                        processName,
                                        internalRequestGuid
                                    },
                                    section: 'httpRequest.js'
                                }, ex);
                            }
                        }
                        if (onProgress && chayns.utils.isFunction(onProgress)) {
                            req.addEventListener('progress', (event) => {
                                if (event.lengthComputable) {
                                    onProgress((event.loaded / event.total) * 100, event.loaded, event.total);
                                } else {
                                    // eslint-disable-next-line no-console
                                    console.warn(...colorLog({
                                        '[HttpRequest]': 'color: #aaaaaa',
                                        // eslint-disable-next-line max-len
                                        'Can\'t monitor progress: length not computable': ''
                                    }));
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
                if (!response) {
                    throw new RequestError(
                        `[HttpRequest] Failed to fetch on ${processName}: Response is not defined`,
                        1
                    );
                }
            } catch (err) {
                const failedToFetchLog = getLogFunctionByStatus(1, logConfig, logger.warning);
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
                    [`Failed to fetch on ${processName}`]: ''
                }), err, '\nInput: ', input);
                err.statusCode = 1;
                tryReject(err, 1, true);
                return;
            }

            const { status } = response;

            const log = (() => {
                let defaultLog = logger.error;
                if (status < 400) defaultLog = logger.info;
                if (status === 401) defaultLog = logger.warning;
                return getLogFunctionByStatus(status, logConfig, defaultLog);
            })();

            /** LOGS */
            const sessionUid = useFetchApi
                               ? response.headers && response.headers.get('X-Request-Id')
                                 ? response.headers.get('X-Request-Id') : undefined
                               : response.getAllResponseHeaders && response.getResponseHeader('X-Request-Id')
                                 ? response.getResponseHeader('X-Request-Id') : undefined;

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
                    additionalLogData,
                    address: requestAddress,
                    input,
                    method,
                    body,
                    headers: {
                        ...requestHeaders,
                        Authorization: undefined
                    },
                    status,
                    sessionUid,
                    responseBody,
                    processName,
                    online: `${navigator?.onLine}, ${navigator?.connection?.effectiveType}`,
                    requestDuration: `${Date.now() - fetchStartTime} ms`,
                    requestTime: new Date(fetchStartTime).toISOString(),
                    internalRequestGuid
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
                log({
                    ...logData,
                    message: `[HttpRequest] http request failed: Status ${status} on ${processName}`,
                }, error);
                // eslint-disable-next-line no-console
                console.error(...colorLog({
                    '[HttpRequest]': 'color: #aaaaaa'
                }), error, '\nInput: ', input);
                if (!ignoreErrors && useChaynsAuth && autoRefreshToken) {
                    try {
                        const jRes = await response.json();
                        if (jRes.message === 'token_expired') {
                            resolve(httpRequest(address, config, processName, {
                                responseType,
                                logConfig,
                                ignoreErrors,
                                useFetchApi,
                                stringifyBody,
                                additionalLogData,
                                autoRefreshToken: false,
                                statusHandlers,
                                onProgress,
                                addHashToUrl,
                                internalRequestGuid
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
                console.error(...colorLog({
                    '[HttpRequest]': 'color: #aaaaaa'
                }), error, '\nInput: ', input);
                tryReject(error, status);
            }

            /** RESPONSE HANDLING */
            /*
             * Response handling priorities:
             * 1. statusHandlers[status]
             * 2. statusHandlers[regex]
             * 3. response type
             *    3.1. if onProgress: onProgress => response Type
             *    3.2. responseType
             */

            // statusHandlers[status]
            if (statusHandlers.has(`${status}`)) {
                if (chayns.utils.isFunction(statusHandlers.get(`${status}`))) {
                    resolve(await statusHandlers.get(`${status}`)(response));
                } else {
                    switch (statusHandlers.get(`${status}`)) {
                        case ResponseType.Json:
                            await jsonResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                            return;
                        case ResponseType.Blob:
                            await blobResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                            return;
                        case ResponseType.Object:
                            await objectResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                            return;
                        case ResponseType.Text:
                            await textResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                            return;
                        case ResponseType.None:
                            resolve();
                            return;
                        case ResponseType.Error:
                            reject(new RequestError(`Status ${status} on ${processName}`, status));
                            return;
                        case ResponseType.Response:
                        default:
                            resolve(response);
                            return;
                    }
                }
            }
            // statusHandlers[regex]
            if (!statusHandlers || statusHandlers.size === 0) {
                const keys = getMapKeys(statusHandlers);
                for (let i = 0; i < keys.length; i += 1) {
                    const regExp = stringToRegex(keys[i]);
                    if (regExp.test(status?.toString()) && chayns.utils.isFunction(statusHandlers.get(keys[i]))) {
                        // eslint-disable-next-line no-await-in-loop
                        resolve(await statusHandlers.get(keys[i])(response));
                        return;
                    }
                    if (regExp.test(status?.toString()) && Object.values(ResponseType)
                        .includes(statusHandlers.get(keys[i]))) {
                        switch (statusHandlers.get(keys[i])) {
                            case ResponseType.Json:
                                // eslint-disable-next-line no-await-in-loop
                                await jsonResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                                return;
                            case ResponseType.Blob:
                                // eslint-disable-next-line no-await-in-loop
                                await blobResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                                return;
                            case ResponseType.Object:
                                // eslint-disable-next-line no-await-in-loop
                                await objectResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                                return;
                            case ResponseType.Text:
                                // eslint-disable-next-line no-await-in-loop
                                await textResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                                return;
                            case ResponseType.None:
                                resolve();
                                return;
                            case ResponseType.Error:
                                reject(new RequestError(`Status ${status} on ${processName}`, status));
                                return;
                            case ResponseType.Response:
                            default:
                                resolve(response);
                                return;
                        }
                    }
                }
            }

            // onProgress => responseType
            if (onProgress && chayns.utils.isFunction(onProgress) && useFetchApi) {
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
                        logger.warning({
                            message: `[HttpRequest] Parsing JSON body failed on Status ${status} on ${processName}`,
                            data: { internalRequestGuid }
                        }, err);
                        // eslint-disable-next-line no-console
                        console.error(...colorLog({
                            '[HttpRequest]': 'color: #aaaaaa',
                            // eslint-disable-next-line max-len
                            [`Parsing JSON body failed on Status ${status} on ${processName}`]: ''
                        }), err, '\nInput: ', input);
                        if (status >= 200 && status < 300) {
                            resolve(null);
                        } else {
                            tryReject(null, status);
                        }
                    }
                }
                if (responseType === ResponseType.Object) {
                    try {
                        resolve({
                            status,
                            data: JSON.parse(result)
                        });
                    } catch (err) {
                        logger.warning({
                            message: `[HttpRequest] Parsing JSON body failed on Status ${status} on ${processName}`,
                            data: { internalRequestGuid }
                        }, err);
                        // eslint-disable-next-line no-console
                        console.error(...colorLog({
                            '[HttpRequest]': 'color: #aaaaaa',
                            // eslint-disable-next-line max-len
                            [`Parsing JSON body failed on Status ${status} on ${processName}`]: ''
                        }), err, '\nInput: ', input);
                        if (status >= 200 && status < 300) {
                            resolve(null);
                        } else {
                            tryReject(null, status);
                        }
                    }
                }
                if (responseType === ResponseType.Text) {
                    try {
                        resolve(result);
                    } catch (err) {
                        logger.warning({
                            message: `[HttpRequest] Parsing JSON body failed on Status ${status} on ${processName}`,
                            data: { internalRequestGuid }
                        }, err);
                        // eslint-disable-next-line no-console
                        console.error(...colorLog({
                            '[HttpRequest]': 'color: #aaaaaa',
                            // eslint-disable-next-line max-len
                            [`Parsing JSON body failed on Status ${status} on ${processName}`]: ''
                        }), err, '\nInput: ', input);
                        if (status >= 200 && status < 300) {
                            resolve(null);
                        } else {
                            tryReject(null, status);
                        }
                    }
                }
                if (responseType === ResponseType.None) {
                    resolve();
                }
                if (responseType === ResponseType.Response) {
                    response.bodyString = result;
                    resolve(response);
                }
            } else {
                // responseType
                if (responseType === null || responseType === ResponseType.Json) {
                    await jsonResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                } else if (responseType === ResponseType.Blob) {
                    await blobResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                } else if (responseType === ResponseType.Object) {
                    await objectResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                } else if (responseType === ResponseType.Text) {
                    await textResolve(response, processName, resolve, useFetchApi, internalRequestGuid);
                } else if (responseType === ResponseType.None) {
                    resolve(null);
                } else if (responseType === ResponseType.Response) {
                    resolve(response);
                } else {
                    resolve(response);
                }
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
 * @param {boolean} [options.useFetchApi=true] - use fetch(), use XMLHttpRequest otherwise
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
 * @param {onProgressHandler} [options.onProgress=null] - Gets called multiple times during the download of bigger
 *     data,
 *     e.g. for progress bars. Prevents the use of .json() and .blob() if useFetchApi is true. A param "stringBody" is
 *     added to read the body instead. Response types other than 'response' will work as usual.
 * @param {boolean} [options.addHashToUrl=false] - Add a random hash as URL param to bypass the browser cache
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
    presets: requestPresets,
    defaults: setRequestDefaults,
    full: fullRequest
};

export default request;
