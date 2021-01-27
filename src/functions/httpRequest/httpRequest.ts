import isNullOrWhiteSpace from '../../utils/isNullOrWhiteSpace';
// @ts-expect-error
import logger from 'chayns-logger';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import chalk from 'chalk';
import generateUUID from '../generateUid';
import stringToRegex, { regexRegex } from '../../utils/stringToRegex';
import ChaynsError from './ChaynsError';
import HttpMethod, { HttpMethodEnum } from './HttpMethod';
import {
    blobResolve,
    getLogFunctionByStatus,
    getMapKeys,
    getStatusHandlerByStatusRegex,
    jsonResolve,
    mergeOptions,
    objectResolve,
    resolveWithHandler,
    textResolve
} from './httpRequestUtils';
import { chaynsErrorCodeRegex } from './isChaynsError';
import RequestError from './RequestError';
import ResponseType, { ResponseTypeEnum } from './ResponseType';
import LogLevel, { LogLevelEnum, ObjectResponse } from './LogLevel';
import setRequestDefaults, { defaultConfig } from './setRequestDefaults';
import { HttpStatusCodeEnum } from './HttpStatusCodes';
import showWaitCursor from '../waitCursor/waitCursor';
import getJsonSettings, { JsonSettings } from '../getJsonSettings';

/**
 * The fetch config
 */
export interface HttpRequestConfig {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT' | string | typeof HttpMethodEnum;
    /**
     * add user token as authorization
     */
    useChaynsAuth?: boolean;
    headers?: object;
    body?: object | string | FormData | any,
    cache?: string;
    referrer?: string;
    referrerPolicy?: string;
    mode?: string;
    redirect?: string;
    integrity?: string;
    keepalive?: string;
    window?: Window;
    signal?: AbortSignal;
}

/**
 * Additional request options
 */
export interface HttpRequestOptions {
    responseType?: typeof ResponseTypeEnum | string | null;
    throwErrors?: boolean | Array<typeof HttpStatusCodeEnum | string | number>;
    logConfig?: { [key: string]: typeof LogLevelEnum | string } | Map<string, typeof LogLevelEnum | string>,
    stringifyBody?: boolean | JsonSettings;
    additionalLogData?: object;
    autoRefreshToken?: boolean;
    waitCursor?: boolean
        | { text?: string, textTimeout?: number, timeout?: number, }
        | { timeout?: number, steps?: { [timeout: number]: string }; },
    statusHandlers?: { [key: string]: typeof ResponseTypeEnum | string | ((response: Response) => any) } | Map<string, typeof ResponseTypeEnum | string | ((response: Response) => any)>;
    errorHandlers?: { [key: string]: typeof ResponseTypeEnum | string | ((response: Response) => any) } | Map<string, typeof ResponseTypeEnum | string | ((response: Response) => any)>;
    errorDialogs?: Array<string | RegExp>;
    replacements?: { [key: string]: string | ((substring: string, ...args: any[]) => string) };
    sideEffects?: ((status: number) => void) | { [status: string]: () => void } | {}
    internalRequestGuid?: string
}

export type httpRequestResult = Response | ObjectResponse | Blob | Object | string | RequestError | ChaynsError | any

/**
 * Extensive and highly customizable fetch helper. Consult httpRequest.md for usage.
 * @param address
 * @param config
 * @param processName
 * @param options
 */
export function httpRequest(
    // full request address. URLs should be defined as functions or constants in a separate file
    address: string,
    // fetch config
    config: HttpRequestConfig = {},
    // processName for logs
    processName: string = 'httpRequest',
    // options for this helper
    options: HttpRequestOptions = {},
): Promise<httpRequestResult> {
    const {
        responseType = null,
        /**
         * log level config of each status code
         * Defaults: status<400 : info, status=401: warning, else: error
         * @type {Object.<string|RegExp,LogLevel|string>}
         */
        // logConfig = {},
        // bool|number[]: don't throw errors on error status codes, return null instead
        throwErrors,
        // bool: call JSON.stringify() on the body passed to this function
        stringifyBody: defaultStringify = true,
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
        waitCursor = false,
        internalRequestGuid = generateUUID(),
        errorDialogs = [],
        replacements = {}
    }: HttpRequestOptions = {
        responseType: ResponseType.Json,
        // logConfig: {},
        throwErrors: false,
        stringifyBody: true,
        additionalLogData: {},
        autoRefreshToken: true,
        // statusHandlers: {},
        replacements: {
            [/##locationId##/g.toString()]: `${chayns.env.site.locationId}`,
            [/##siteId##/g.toString()]: `${chayns.env.site.id}`,
            [/##tappId##/g.toString()]: `${chayns.env.site.tapp.id}`,
            [/##userId##/g.toString()]: `${chayns.env.user.id}`,
            [/##personId##/g.toString()]: `${chayns.env.user.personId}`
        },
        errorDialogs: [],
        ...(defaultConfig.options || {}),
        ...(options || {})
    };
    let hideWaitCursor;

    if (waitCursor) {
        hideWaitCursor = showWaitCursor(
            { action: `[HttpRequest] ${processName}`, ...(typeof waitCursor !== 'boolean' ? waitCursor : {}) },
            (<{ timeout?: number, steps?: { [timeout: number]: string }; }>waitCursor)?.steps
        );
    }
    const requestPromise = new Promise((globalResolve, reject) => {
        (async () => {
// INPUT HANDLING START
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

            const stringifyBody = typeof defaultConfig.options.stringifyBody === 'object'
                                  && typeof options.stringifyBody === 'object'
                ? { ...defaultConfig.options.stringifyBody, ...options.stringifyBody }
                : defaultStringify

            const optionEffects = options?.sideEffects;
            const defaultEffects = defaultConfig?.options?.sideEffects;
            let sideEffects = options.sideEffects;
            if (typeof optionEffects === 'object' && typeof defaultEffects === 'object') {
                sideEffects = {
                    ...defaultConfig.options?.sideEffects,
                    ...options?.sideEffects
                };
            } else if (!optionEffects && defaultEffects) {
                sideEffects = defaultEffects;
            }
            const sideEffect: (((status: number) => void) | { [status: number]: () => void }) = sideEffects || (() => {
            });
            const callSideEffects = typeof sideEffect === 'function'
                // @ts-expect-error
                ? (status: number) => { sideEffect(status); }
                : (status: number) => {
                    (sideEffect[status] || (() => {}))();
                };

            // eslint-disable-next-line no-param-reassign
            if (!processName) processName = 'HttpRequest';
            if (responseType != null && !Object.values(ResponseType)
                .includes(<string>responseType)) {
                console.error(
                    chalk.hex('#aaaaaa')(`[HttpRequest<${processName}>]`),
                    `Response type "${responseType}" is not valid. Use json|blob|response|object|none instead.`
                );
                reject(new Error('Invalid responseType'));
                return;
            }

            // read config object
            const fetchConfig: HttpRequestConfig = {
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

            const jsonSettings = typeof stringifyBody !== 'boolean' && typeof stringifyBody === 'object'
                ? getJsonSettings(stringifyBody)
                : null;

            // @ts-expect-error
            const jsonBody: string | null = body && stringifyBody ? JSON.stringify(body, jsonSettings) : null;

            // create request headers
            let requestHeaders: HeadersInit = body && stringifyBody ? { 'Content-Type': 'application/json' } : {};
            if (useChaynsAuth) requestHeaders.Authorization = `Bearer ${chayns.env.user.tobitAccessToken}`;
            requestHeaders = {
                ...requestHeaders,
                ...(defaultConfig?.config?.headers || {}),
                ...headers
            };

            // this way other config elements like "credentials", "mode", "cache" or "signal" can be passed to fetch()
            const remainingFetchConfig: RequestInit = <RequestInit>{ ...fetchConfig };
            // @ts-expect-error
            delete remainingFetchConfig.useChaynsAuth;

            let requestAddress: string = '';
            if (!isNullOrWhiteSpace(defaultConfig.address)
                && !/^.+?:\/\//.test(address)
                && /^.+?:\/\//.test(defaultConfig.address)) {
                requestAddress = `${defaultConfig.address}${address}`;
            } else {
                requestAddress = address;
            }
            if (replacements && chayns.utils.isObject(replacements)) {
                const replacementKeys: Array<string> = Object.keys(replacements);
                for (let i = 0; i < replacementKeys.length; i++) {
                    if (regexRegex.test(replacementKeys[i])) {
                        const regex = stringToRegex(replacementKeys[i]);
                        requestAddress = requestAddress.replace(regex, `${replacements[replacementKeys[i]]}`);
                    } else {
                        requestAddress = requestAddress.replace(
                            replacementKeys[i],
                            `${replacements[replacementKeys[i]]}`
                        );
                    }
                }
            }
// INPUT HANDLING END
            const getHandlers = (status: number, err?: Error | RequestError | ChaynsError) => {
                // get statusHandler if exists
                const handlerKeys = getMapKeys(statusHandlers);
                const statusHandlerKey = handlerKeys.find((k) =>
                    (k === `${status}` || stringToRegex(k)
                        .test(`${status}`))
                    && (typeof (statusHandlers.get(k)) === 'function'
                        || Object.values(ResponseType)
                            .includes(statusHandlers.get(k)))
                );

                // get errorHandler if exists
                const errorKeys = getMapKeys(errorHandlers);
                const isChayns: boolean = !!err && (err instanceof ChaynsError);
                const chaynsErrorCode: string | null = isChayns ? (<ChaynsError>err).errorCode : null;
                const errorHandlerKey = errorKeys.find((k) =>
                    (chaynsErrorCode && (k === chaynsErrorCode || stringToRegex(k)
                        .test(chaynsErrorCode)))
                    && (typeof (errorHandlers.get(k)) === 'function'
                        || Object.values(ResponseType)
                            .includes(errorHandlers.get(k)))
                );
                return {
                    statusHandler: statusHandlers.get(statusHandlerKey),
                    errorHandler: errorHandlers.get(errorHandlerKey)
                };
            };

            const resolve = (value?: any) => {
                globalResolve(value);
                logger.info({
                    message: `[HttpRequest] ${processName} resolved`,
                    data: {
                        resolveValue: value,
                        internalRequestGuid
                    }
                });
            };

            const tryReject = (
                err: Error | RequestError | ChaynsError,
                status: number,
                response?: Response
            ): boolean => {
                const {
                    statusHandler,
                    errorHandler
                } = getHandlers(status, err);
                if (errorHandler || statusHandler) {
                    return false;
                } else {
                    if (!throwErrors
                        || (status && Array.isArray(throwErrors) && throwErrors.includes(status))
                    ) {
                        return false;
                    } else {
                        callSideEffects(status);
                        reject(err);
                        return true;
                    }
                }
            };

            const fetchStartTime = Date.now();

// REQUEST
            let response;
            try {
                response = await fetch(requestAddress, {
                    ...remainingFetchConfig,
                    method: <string>method,
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
// HANDLE FAILED TO FETCH START
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
                        // @ts-expect-error
                        online: `${navigator?.onLine}, ${navigator?.connection?.effectiveType}`,
                        processName,
                        requestDuration: `${Date.now() - fetchStartTime} ms`,
                        requestTime: new Date(fetchStartTime).toISOString(),
                        internalRequestGuid
                    },
                    section: 'httpRequest.js'
                }, err);
                console.error(
                    chalk.hex('#aaaaaa')(`[HttpRequest<${processName}>]`),
                    `Request failed:`, err, '\nInput: ', input
                );
                err.statusCode = 1;
                const status = 1;
                const {
                    statusHandler,
                    errorHandler
                } = getHandlers(status, err);
                if (errorHandler) {
                    callSideEffects(status);
                    await resolveWithHandler(
                        errorHandler,
                        <Response>({ status }),
                        status,
                        processName,
                        resolve,
                        reject,
                        internalRequestGuid
                    );
                    return;
                } else if (statusHandler) {
                    callSideEffects(status);
                    await resolveWithHandler(
                        statusHandler,
                        <Response>({ status }),
                        status,
                        processName,
                        resolve,
                        reject,
                        internalRequestGuid
                    );
                    return;
                } else {
                    if (!throwErrors
                        || (status && Array.isArray(throwErrors) && throwErrors.includes(status))
                    ) {
                        callSideEffects(status);
                        switch (responseType) {
                            case ResponseType.Object:
                                resolve({
                                    status,
                                    data: null
                                });
                                break;
                            case ResponseType.None:
                                resolve();
                                break;
                            case ResponseType.Error:
                                const error = new RequestError(`Status ${status} on ${processName}`, status);
                                console.error(
                                    chalk.hex('#aaaaaa')(`[HttpRequest<${processName}>]`),
                                    'ResponseType \'error\':', error, '\nInput: ', input
                                );
                                reject(error);
                                break;
                            case ResponseType.Response:
                                resolve(response || { status });
                                break;
                            case ResponseType.Text:
                            case ResponseType.Blob:
                            case ResponseType.Json:
                            default:
                                resolve(response || null);
                                break;
                        }
                        return;
                    } else {
                        callSideEffects(status);
                        reject(err);
                        return;
                    }
                }
// HANDLE FAILED TO FETCH END
            }

            const { status } = response;

// LOGS
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
                    // @ts-expect-error
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
            if (chaynsErrorObject) {
                chaynsErrorObject.showDialog = !!errorDialogs.find((e) =>
                    (e === chaynsErrorObject.errorCode)
                    || (Object.prototype.toString.call(e) === '[object RegExp]'
                        && (<RegExp>e).test(chaynsErrorObject.errorCode)
                    ));
            }
            if (chaynsErrorObject && chaynsErrorObject?.showDialog) {
                chayns.dialog.alert('', chaynsErrorObject.displayMessage);
            }

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
                console.error(
                    chalk.hex('#aaaaaa')(`[HttpRequest<${processName}>]`),
                    error, '\nInput: ', input
                );
                if (useChaynsAuth && autoRefreshToken) {
                    try {
                        let jRes: { [key: string]: any } = {};
                        try { jRes = await response.json(); } catch (e) { /* ignored */ }
                        if (jRes.message === 'token_expired') {
                            callSideEffects(<number>status);
                            resolve(httpRequest(address, config, processName, {
                                responseType,
                                logConfig,
                                throwErrors,
                                stringifyBody,
                                additionalLogData,
                                autoRefreshToken: false,
                                statusHandlers,
                                errorHandlers,
                                internalRequestGuid
                            }));
                        } else {
                            if (tryReject(error, status, response)) return;
                        }
                    } catch (err) {
                        if (tryReject(error, status, response)) return;
                    }
                } else {
                    if (tryReject(error, status, response)) return;
                }
            } else {
                const error = chaynsErrorObject
                    ? new ChaynsError(chaynsErrorObject, processName, status)
                    : new RequestError(`Status ${status} on ${processName}`, status);
                log({
                    ...logData,
                    message: `[HttpRequest] http request failed: Status ${status} on ${processName}`
                }, error);
                console.error(
                    chalk.hex('#aaaaaa')(`[HttpRequest<${processName}>]`),
                    error, '\nInput: ', input
                );
                tryReject(error, status, response);
            }

// RESPONSE HANDLING
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
                    if (result) {
                        callSideEffects(<number>status);
                        return;
                    }
                }
                // 1.2 errorHandlers[chaynsErrorRegex]
                if (errorHandlers && errorHandlers.size > 0) {
                    const errorKeys = getMapKeys(errorHandlers);
                    const key: string = errorKeys.find((k) => (
                        chaynsErrorCodeRegex.test(k)
                        && stringToRegex(key)
                            .test(errorCode)
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
                        if (result) {
                            callSideEffects(<number>status);
                            return;
                        }
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
                if (result) {
                    callSideEffects(<number>status);
                    return;
                }
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
                    if (result) {
                        callSideEffects(<number>status);
                        return;
                    }
                }
            }

            // 3. responseType
            callSideEffects(<number>status);
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
    if (waitCursor) {
        requestPromise.finally(hideWaitCursor);
    }
    return requestPromise;
}

const request = {
    fetch: httpRequest,
    error: RequestError,
    responseType: ResponseType,
    logLevel: LogLevel,
    method: HttpMethod,
    defaults: setRequestDefaults,
};

export default request;
