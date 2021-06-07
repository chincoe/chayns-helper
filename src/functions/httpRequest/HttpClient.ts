/* eslint-disable no-console */
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import { ResponseType, ResponseTypeList } from './ResponseType';
import {
    DefaultType, ExcludeEmptyOptions, RequestResult, RequestResultWrapper
} from './types';
import generateUUID from '../generateGuid';
import colorLog from '../../utils/colorLog';
import showWaitCursor from '../waitCursor';
import {
    getLogFunctionByStatus,
    getMapKeys,
    getStatusHandlerByStatusRegex,
    mergeOptions,
    resolveWithHandler
} from './httpRequestUtils';
import ChaynsError, { ChaynsErrorObject } from './ChaynsError';
import HttpMethod from './HttpMethod';
import getJsonSettings, { JsonSettings } from '../getJsonSettings';
import isNullOrWhiteSpace from '../../utils/isNullOrWhiteSpace';
import stringToRegex, { regexRegex, stringToRegexStrict } from '../../utils/stringToRegex';
import RequestError from './RequestError';
import logger from '../../utils/requireChaynsLogger';
import jsonLog from '../../utils/jsonLog';
import getJwtPayload from '../getJwtPayload';
import HttpStatusCode from './HttpStatusCodes';
import LogLevel from './LogLevel';

/**
 * The fetch config. Contains all parameters viable for the window.fetch init object including the following:
 * @property useChaynsAuth - default: chayns.env.user.isAuthenticated - Add use token as auth header
 * @property method - default: 'GET' - HttpMethod
 * @property headers - plain JS object with headers
 * @property body - the request body
 * @property signal - an AbortSignal
 * @property cache - the cache behavior
 * @property referrer
 * @property referrerPolicy
 * @property mode - the fetch mode
 * @property credentials - the credentials behavior
 * @property redirect - the redirect behavior
 * @property integrity
 * @property keepalive
 * @property window
 */
export type HttpRequestConfig = {
    method?: HttpMethod | string;
    useChaynsAuth?: boolean;
    headers?: HeadersInit | Record<string, string> & {
        Authorization?: string
            /* eslint-disable no-template-curly-in-string */
            | 'Bearer ${chayns.env.user.tobitAccessToken}'
            | 'Bearer ${token}'
            | 'Basic ${credentials}'
            | 'Basic ${btoa(`${user}:${secret}`).replace(`+`, `-`).replace(`/`, `_`).replace(/=+$/, ``)}';
        /* eslint-enable no-template-curly-in-string */
        'Content-Type'?: string
            | 'application/json'
            | 'text/plain'
            | 'application/x-www-form-urlencoded'
            | 'multipart/form-data';
    };
    body?: Record<string, unknown> | BodyInit;
    cache?: string | 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
    referrer?: string;
    referrerPolicy?: string
        | 'no-referrer'
        | 'no-referrer-when-downgrade'
        | 'same-origin, origin'
        | 'strict-origin'
        | 'origin-when-cross-origin'
        | 'strict-origin-when-cross-origin'
        | 'unsafe-url';
    mode?: string | 'cors' | 'no-cors' | 'same-origin';
    credentials?: string | 'omit' | 'same-origin' | 'include';
    redirect?: string | 'follow' | 'manual' | 'error';
    integrity?: string;
    keepalive?: boolean;
    window?: Window;
    signal?: AbortSignal;
}

/**
 * Additional request options. Consult documentation for details
 * @property responseType - default: 'json' - the data format this helper should return
 * @property throwErrors - default: false - throw errors on error status codes
 * @property logConfig - configure which status code should be logged with which level
 * @property stringifyBody - default: true - call JSON.stringify on the body. Accepts an object to configure serializer
 *     settings
 * @property additionalLogData - additional data to to be passed to the request logs
 * @property autoRefreshToken - default: true - automatically refresh an expired chayns token and repeat the request
 * @property waitCursor - default: false - show a chayns waitCursor, pass an object to configure text, delay, and
 *     multiple steps
 * @property statusHandlers - modify the return value for specific status codes
 * @property errorHandlers - modify the return value for specific chayns errors
 * @property errorDialogs - list of chayns errors to display a dialog for
 * @property replacements - object with url string replacements
 * @property sideEffects - additional effects to be executed on certain status codes
 * @property internalRequestGuid - internal guid to group logs for the same request together
 */
export type HttpRequestOptions = {
    responseType?: ResponseType | null;
    throwErrors?: boolean | Array<HttpStatusCode | number>;
    logConfig?: Record<string, LogLevel> | Map<string, LogLevel>;
    stringifyBody?: boolean | JsonSettings;
    additionalLogData?: Record<string, unknown>;
    autoRefreshToken?: boolean;
    waitCursor?: boolean
        | { text?: string, textTimeout?: number, timeout?: number, }
        | { timeout?: number, steps?: { [timeout: number]: string }; };
    statusHandlers?: Record<string, ResponseType | ((response: Response & ChaynsErrorObject) => unknown)>;
    errorHandlers?: Record<string, ResponseType | ((response: Response & ChaynsErrorObject) => unknown)>;
    errorDialogs?: Array<string | RegExp>;
    replacements?: Record<string, string | ((substring: string, ...args: unknown[]) => string)>;
    sideEffects?: ((status: number, chaynsErrorObject?: ChaynsErrorObject) => void)
        | Record<string, (chaynsErrorObject?: ChaynsErrorObject) => void>
        | Record<string, never>;
    internalRequestGuid?: string;
}

export type DefaultConfig<TConfig extends Partial<HttpRequestConfig>, TOptions extends Partial<HttpRequestOptions>> = {
    address: string,
    config: TConfig,
    options: TOptions
}

// noinspection JSUnusedGlobalSymbols
export default class HttpClient<TDConfig extends Partial<HttpRequestConfig>,
    TDOptions extends Partial<HttpRequestOptions>> {
    private defaultConfig: DefaultConfig<TDConfig, TDOptions>;

    constructor(defaults: Partial<DefaultConfig<TDConfig, TDOptions>> = {}) {
        this.defaultConfig = {
            address: defaults?.address || '',
            config: defaults?.config || {} as TDConfig,
            options: defaults?.options || {} as TDOptions
        };
    }

    public fetch<TOptions extends HttpRequestOptions>(
        address: string,
        config: HttpRequestConfig = {},
        processName = 'httpRequest',
        options: TOptions = {} as TOptions
    ): Promise<RequestResultWrapper<ExcludeEmptyOptions<TOptions,
        RequestResult<TOptions>> | ExcludeEmptyOptions<TDOptions, RequestResult<TDOptions>>>> {
        const { defaultConfig } = this;
        let { responseType = null } = {
            responseType: ResponseType.Json,
            ...(this.defaultConfig.options || {}),
            ...(options || {})
        };
        const {
            throwErrors,
            stringifyBody: defaultStringify = true,
            additionalLogData = {},
            autoRefreshToken = true,
            waitCursor = false,
            internalRequestGuid = generateUUID(),
            errorDialogs = [],
        }: HttpRequestOptions = {
            throwErrors: false,
            stringifyBody: true,
            additionalLogData: {},
            autoRefreshToken: true,
            errorDialogs: [],
            ...(defaultConfig.options || {}),
            ...(options || {})
        };
        let hideWaitCursor;

        // TODO: Remove in future release
        if (responseType === ResponseType.Object) {
            console.warn(
                ...colorLog.gray(`[HttpRequest<${processName}>]`),
                // eslint-disable-next-line max-len
                'ResponseType.Object is deprecated and will be removed in the future. Use ResponseType.JsonWithStatus instead.'
            );
            responseType = ResponseType.JsonWithStatus;
        }

        if (waitCursor) {
            hideWaitCursor = showWaitCursor(
                { action: `[HttpRequest] ${processName}`, ...(typeof waitCursor !== 'boolean' ? waitCursor : {}) },
                (<{ timeout?: number, steps?: { [timeout: number]: string }; }>waitCursor)?.steps
            );
        }
        const requestPromise = new Promise<any>((globalResolve, reject) => {
            (async () => {
// INPUT HANDLING START
                const input = {
                    address,
                    config,
                    options
                };
                console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Starting Request', {
                    input,
                    defaults: {
                        options: defaultConfig.options,
                        config: defaultConfig.config
                    }
                });
                // properly merge the status handlers and log config of options and default options. The function
                // returns a map to have a reliable key order to ensure that all options have a higher priority than
                // default options

                // merge status handlers
                const statusHandlers = mergeOptions(
                    (options?.statusHandlers || {}),
                    (defaultConfig?.options?.statusHandlers || {})
                );
                // merge chayns error handlers
                const errorHandlers = mergeOptions(
                    (options?.errorHandlers || {}),
                    (defaultConfig?.options?.errorHandlers || {})
                );
                // merge log config
                const logConfig = mergeOptions((options?.logConfig || {}), (defaultConfig?.options?.logConfig || {}));
                // merge json settings if applicable
                const stringifyBody = typeof defaultConfig.options.stringifyBody === 'object'
                && typeof options.stringifyBody === 'object'
                    ? { ...defaultConfig.options.stringifyBody, ...options.stringifyBody }
                    : defaultStringify;
                // merge url replacements
                const replacements = {
                    [/##locationId##/ig.toString()]: `${chayns.env.site.locationId}`,
                    [/##siteId##/ig.toString()]: `${chayns.env.site.id}`,
                    [/##tappId##/ig.toString()]: `${chayns.env.site.tapp.id}`,
                    [/##userId##/ig.toString()]: `${chayns.env.user.id}`,
                    [/##personId##/ig.toString()]: `${chayns.env.user.personId}`,
                    ...(defaultConfig?.options?.replacements || {}),
                    ...(options?.replacements || {})
                };
                // merge side effects
                const optionEffects = options?.sideEffects;
                const defaultEffects = defaultConfig?.options?.sideEffects;
                let { sideEffects } = options;
                if (typeof optionEffects === 'object' && typeof defaultEffects === 'object') {
                    sideEffects = {
                        ...defaultConfig.options?.sideEffects,
                        ...options?.sideEffects
                    };
                } else if (!optionEffects && defaultEffects) {
                    sideEffects = defaultEffects;
                }
                const sideEffect: ((status: number, chaynsErrorObject?: ChaynsErrorObject) => void)
                    | Record<string, (chaynsErrorObject?: ChaynsErrorObject) => void> = sideEffects
                    || (() => undefined);

                // set default for process name
                // eslint-disable-next-line no-param-reassign
                if (!processName) processName = 'HttpRequest';
                // validate responseType
                if (responseType != null && !ResponseTypeList.includes(responseType)) {
                    console.error(
                        ...colorLog.gray(`[HttpRequest<${processName}>]`),
                        // eslint-disable-next-line max-len
                        `Response type "${responseType}" is not valid. Use ResponseType.[Json|Text|Response|None|Blob|Status.Json] instead.`
                    );
                    reject(new Error('Invalid responseType'));
                    return;
                }

                // read fetch config object
                const fetchConfig: HttpRequestConfig = {
                    method: HttpMethod.Get,
                    useChaynsAuth: chayns.env.user.isAuthenticated,
                    ...(defaultConfig.config || {}),
                    ...(config || {})
                };
                // log warning due to unreliability with opaque responses
                if (fetchConfig.mode === 'no-cors') {
                    console.warn(
                        ...colorLog.gray(`[HttpRequest<${processName}>]`),
                        // eslint-disable-next-line max-len
                        '`mode:\'no-cors\'` will remove your authorization header and return an opaque response with status code 0. Please check if `credentials: \'omit\' yields the desired result first.`'
                    );
                }
                const {
                    method,
                    useChaynsAuth,
                    body,
                    headers
                } = fetchConfig;
                // create json body
                const jsonSettings = typeof stringifyBody !== 'boolean' && typeof stringifyBody === 'object'
                    ? getJsonSettings(stringifyBody)
                    : undefined;
                const jsonBody: string | null = body && stringifyBody ? JSON.stringify(body, jsonSettings) : null;

                // create request headers
                let requestHeaders: HeadersInit = body && stringifyBody ? { 'Content-Type': 'application/json' } : {};
                if (useChaynsAuth) requestHeaders.Authorization = `Bearer ${chayns.env.user.tobitAccessToken}`;
                requestHeaders = {
                    ...(requestHeaders as HeadersInit),
                    ...(defaultConfig?.config?.headers || {}),
                    ...headers
                };

                // this way fetch config elements like "credentials", "mode", or "signal" can be passed to fetch()
                const remainingFetchConfig: RequestInit = <RequestInit>{ ...fetchConfig };
                // @ts-expect-error .useChaynsAuth is present but not included in type to avoid further issues
                delete remainingFetchConfig.useChaynsAuth;

                // create request address
                let requestAddress: string;
                if (!isNullOrWhiteSpace(defaultConfig.address)
                    && !/^.+?:\/\//.test(address)
                    && /^.+?:\/\//.test(defaultConfig.address)) {
                    requestAddress = `${defaultConfig.address}${address}`;
                } else {
                    requestAddress = address;
                }
                if (replacements && Object.prototype.toString.call(replacements) === '[object Object]') {
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
                console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Input handling finished', {
                    address: requestAddress,
                    headers: requestHeaders,
                    statusHandlers,
                    errorHandlers,
                    logConfig,
                    sideEffect,
                    remainingFetchConfig,
                    stringifyBody,
                    throwErrors,
                    additionalLogData,
                    autoRefreshToken,
                    waitCursor,
                    internalRequestGuid,
                    errorDialogs,
                    responseType
                });
// INPUT HANDLING END
                // define side effects call
                const callSideEffects = (status: number, chaynsErrorObject?: ChaynsErrorObject) => {
                    console.debug(
                        ...colorLog.gray(`[HttpRequest<${processName}>]`), `Calling sideEffect for status ${status}`
                    );
                    if (typeof sideEffect === 'function') {
                        (sideEffect as (status: number, chaynsErrorObject?: ChaynsErrorObject) => void)(
                            status, chaynsErrorObject
                        );
                    } else {
                        const sideEffectList = Object.keys(
                            sideEffects as Record<string, (chaynsErrorObject?: ChaynsErrorObject) => void>
                        ).filter((k) => k === `${status}`
                            || (chaynsErrorObject && k === chaynsErrorObject.errorCode)
                            || stringToRegexStrict(k).test(`${status}`)
                            || (chaynsErrorObject && stringToRegexStrict(k).test(chaynsErrorObject.errorCode)));
                        for (let i = 0; i < sideEffectList.length; ++i) {
                            sideEffect[sideEffectList[i]](chaynsErrorObject);
                        }
                    }
                };
                // define error/status handler getter
                const getHandlers = (status: number, err?: Error | RequestError | ChaynsError) => {
                    // get statusHandler if exists
                    const handlerKeys = getMapKeys(statusHandlers);
                    const statusHandlerKey = handlerKeys.find(
                        (k) => (k === `${status}` || stringToRegexStrict(k).test(`${status}`))
                            && (typeof (statusHandlers.get(k)) === 'function'
                                || ResponseTypeList.includes(statusHandlers.get(k) as ResponseType))
                    );

                    // get errorHandler if exists
                    const errorKeys = getMapKeys(errorHandlers);
                    const isChayns: boolean = !!err && (err instanceof ChaynsError);
                    const chaynsErrorCode: string | null = isChayns ? (<ChaynsError>err).errorCode : null;
                    const errorHandlerKey = errorKeys.find(
                        (k) => (chaynsErrorCode
                            && (k === chaynsErrorCode || stringToRegexStrict(k).test(chaynsErrorCode)))
                            && (typeof (errorHandlers.get(k)) === 'function'
                                || ResponseTypeList.includes(errorHandlers.get(k) as ResponseType))
                    );
                    return {
                        statusHandler: statusHandlers.get(statusHandlerKey as string),
                        errorHandler: errorHandlers.get(errorHandlerKey as string)
                    };
                };
                // define resolve wrapper
                const resolve = (value?: unknown) => {
                    globalResolve(value);
                    console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Resolved with value:', value);
                    logger.info(jsonLog({
                        message: `[HttpRequest] ${processName} resolved`,
                        data: {
                            resolveValue: jsonLog(value, 5000),
                            internalRequestGuid
                        },
                        section: '[chayns-helper]httpRequest.js',
                    }));
                };
                // define reject wrapper
                const tryReject = (
                    err: Error | RequestError | ChaynsError,
                    status: number
                ): boolean => {
                    const {
                        statusHandler,
                        errorHandler
                    } = getHandlers(status, err);
                    console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Trying to reject', {
                        err,
                        errorHandler,
                        status,
                        statusHandler,
                    });
                    if (errorHandler || statusHandler) {
                        return false;
                    }
                    if (!throwErrors || (status && Array.isArray(throwErrors) && throwErrors.includes(status))) {
                        return false;
                    }
                    callSideEffects(status, (err as ChaynsError)?.errorObject);
                    reject(err);
                    return true;
                };

                const fetchStartTime = Date.now();
// REQUEST
                let response;
                try {
                    response = await fetch(requestAddress, {
                        ...remainingFetchConfig,
                        method: <string>method,
                        headers: new Headers(requestHeaders),
                        body: (stringifyBody ? jsonBody : body) as BodyInit
                    });
                    if (!response) {
                        // noinspection ExceptionCaughtLocallyJS
                        throw new RequestError(
                            `[HttpRequest] Failed to fetch on ${processName}: Response is not defined`,
                            1
                        );
                    }
                } catch (err) {
                    console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Failed to fetch', err);
// HANDLE FAILED TO FETCH START
                    const failedToFetchLog = await getLogFunctionByStatus(1, logConfig, logger.warning);
                    failedToFetchLog(jsonLog({
                        message: `[HttpRequest] Failed to fetch on ${processName}`,
                        data: {
                            processName,
                            request: {
                                address: requestAddress,
                                method,
                                body: jsonLog(body, 5000),
                                headers: {
                                    ...requestHeaders,
                                    Authorization: undefined
                                }
                            },
                            response: {
                                status: 1
                            },
                            input,
                            // @ts-expect-error navigator.connection is not typed because it does not exist everywhere
                            online: `${navigator?.onLine}, ${navigator?.connection?.effectiveType}`,
                            requestDuration: `${Date.now() - fetchStartTime} ms`,
                            requestTime: new Date(fetchStartTime).toISOString(),
                            internalRequestGuid,
                            additionalLogData: additionalLogData === {} ? undefined : additionalLogData
                        },
                        section: '[chayns-helper]httpRequest.js',
                    }), err);
                    err.statusCode = 1;
                    const status = 1;
                    const { statusHandler, errorHandler } = getHandlers(status, err);
                    (statusHandler || errorHandler ? console.warn : console.error)(
                        ...colorLog.gray(`[HttpRequest<${processName}>]`),
                        'Request failed:', err, '\nInput: ', input
                    );
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
                    }
                    if (statusHandler) {
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
                    }
                    if (!throwErrors || (status && Array.isArray(throwErrors) && throwErrors.includes(status))) {
                        callSideEffects(status);
                        switch (responseType) {
                            case ResponseType.None:
                                resolve();
                                break;
                            case ResponseType.NoneWithStatus:
                                resolve({ status, data: undefined });
                                break;
                            case ResponseType.BinaryWithStatus:
                            case ResponseType.BlobWithStatus:
                            case ResponseType.JsonWithStatus:
                            case ResponseType.TextWithStatus:
                                resolve({
                                    status,
                                    data: null
                                });
                                break;
                            case ResponseType.ThrowError:
                                const error = new RequestError(`Status ${status} on ${processName}`, status);
                                console.warn(
                                    ...colorLog.gray(`[HttpRequest<${processName}>]`),
                                    'ResponseType \'error\':', error, '\nInput: ', input
                                );
                                reject(error);
                                break;
                            case ResponseType.Response:
                                resolve(response || { status });
                                break;
                            case ResponseType.Binary:
                            case ResponseType.Text:
                            case ResponseType.Blob:
                            case ResponseType.Json:
                                resolve(null);
                                break;
                            default:
                                resolve(response || null);
                                break;
                        }
                        return;
                    }
                    callSideEffects(status);
                    reject(err);
                    return;

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

                const logData = jsonLog({
                    data: {
                        processName,
                        request: {
                            address: requestAddress,
                            method,
                            body: jsonLog(body, 5000),
                            headers: {
                                ...requestHeaders,
                                Authorization: (requestHeaders as { Authorization: string })?.Authorization
                                && !!getJwtPayload((requestHeaders as { Authorization: string })
                                    ?.Authorization)
                                    ? `Payload: ${(requestHeaders as { Authorization: string }).Authorization.split(
                                        '.'
                                    )[1]}`
                                    : undefined
                            },
                        },
                        response: {
                            status,
                            statusText: response.statusText,
                            type: response.type,
                            requestUid,
                            body: jsonLog(responseBody, 5000),
                            url: response.url
                        },
                        input,
                        // @ts-expect-error navigator.connection is not typed because it does not exist everywhere
                        online: `${navigator?.onLine}, ${navigator?.connection?.effectiveType}`,
                        requestDuration: `${Date.now() - fetchStartTime} ms`,
                        requestTime: new Date(fetchStartTime).toISOString(),
                        internalRequestGuid,
                        additionalLogData: additionalLogData === {} ? undefined : additionalLogData
                    },
                    section: '[chayns-helper]httpRequest.js',
                    req_guid: requestUid
                });

                console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Handling Logs', logData);

                let defaultLog = logger.error;
                if (status < 400) {
                    defaultLog = (logger.info as (data: Record<string, unknown>, error?: Error) => void);
                }
                if (status === 401) {
                    defaultLog = logger.warning;
                }
                const log = await getLogFunctionByStatus(status, logConfig, defaultLog, responseBody);

                const chaynsErrorObject = await ChaynsError.getChaynsErrorObject(responseBody);
                if (chaynsErrorObject) {
                    chaynsErrorObject.showDialog = !!errorDialogs.find((e) => (e === chaynsErrorObject.errorCode)
                        || (Object.prototype.toString.call(e)
                            === '[object RegExp]'
                            && (<RegExp>e).test(
                                chaynsErrorObject.errorCode
                            )
                        ));
                }
                if (chaynsErrorObject && chaynsErrorObject?.showDialog) {
                    // noinspection ES6MissingAwait
                    chayns.dialog.alert('', chaynsErrorObject.displayMessage);
                }

                if (response && status < 400) {
                    log({
                        ...logData,
                        message: `[HttpRequest] HTTP request finished: Status ${status} on ${processName}`
                    });
                } else if (response && status === 401) {
                    const error = chaynsErrorObject
                        ? new ChaynsError(chaynsErrorObject, processName, status)
                        : new RequestError(`Status ${status} on ${processName}`, status);
                    log({
                        ...logData,
                        message: `[HttpRequest] HTTP request failed: Status ${status} on ${processName}`,
                    }, error);
                    const { statusHandler, errorHandler } = getHandlers(status, error);
                    (statusHandler || errorHandler || ![logger.critical, logger.error].includes(log)
                        ? console.warn
                        : console.error)(
                        ...colorLog.gray(`[HttpRequest<${processName}>]`),
                        error, '\nInput: ', input
                    );
                    if (useChaynsAuth && autoRefreshToken) {
                        try {
                            let jRes: Record<string, unknown> = {};
                            try { jRes = await response.json(); } catch (e) { /* ignored */ }
                            if (jRes.message === 'token_expired') {
                                callSideEffects(<number>status, chaynsErrorObject || undefined);
                                resolve(this.fetch(address, config, processName, {
                                    ...options,
                                    autoRefreshToken: false
                                }));
                            } else if (tryReject(error, status)) return;
                        } catch (err) {
                            if (tryReject(error, status)) return;
                        }
                    } else if (tryReject(error, status)) return;
                } else {
                    const error = chaynsErrorObject
                        ? new ChaynsError(chaynsErrorObject, processName, status)
                        : new RequestError(`Status ${status} on ${processName}`, status);
                    log({
                        ...logData,
                        message: `[HttpRequest] HTTP request failed: Status ${status} on ${processName}`
                    }, error);
                    const { statusHandler, errorHandler } = getHandlers(status, error);
                    (statusHandler || errorHandler || ![logger.critical, logger.error].includes(log)
                        ? console.warn
                        : console.error)(
                        ...colorLog.gray(`[HttpRequest<${processName}>]`),
                        error, '\nInput: ', input
                    );
                    tryReject(error, status);
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
                        console.debug(
                            ...colorLog.gray(`[HttpRequest<${processName}>]`), 'Resolving with errorHandler', {
                                errorCode,
                                handler
                            }
                        );
                        const result = await resolveWithHandler(
                            handler as ResponseType | ((response: Response) => unknown),
                            response,
                            status,
                            processName,
                            resolve,
                            reject,
                            internalRequestGuid,
                            chaynsErrorObject
                        );
                        if (result) {
                            callSideEffects(<number>status, chaynsErrorObject || undefined);
                            return;
                        }
                    }
                    // 1.2 errorHandlers[chaynsErrorRegex]
                    if (errorHandlers && errorHandlers.size > 0) {
                        const errorKeys = getMapKeys(errorHandlers);
                        const key: string = errorKeys.find((k) => (stringToRegexStrict(k).test(errorCode))) as string;
                        const handler = errorHandlers.get(key);
                        if (handler) {
                            console.debug(
                                ...colorLog.gray(`[HttpRequest<${processName}>]`), 'Resolving with regex errorHandler',
                                {
                                    errorCode,
                                    handler,
                                    key
                                }
                            );
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
                                callSideEffects(<number>status, chaynsErrorObject || undefined);
                                return;
                            }
                        }
                    }
                }

                // 2.1 statusHandlers[status]
                if (statusHandlers && statusHandlers.has(`${status}`)) {
                    const handler = statusHandlers.get(`${status}`);
                    console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Resolving with statusHandler', {
                        handler,
                        status
                    });
                    const result = await resolveWithHandler(
                        handler as ResponseType | ((response: Response) => unknown),
                        response,
                        status,
                        processName,
                        resolve,
                        reject,
                        internalRequestGuid
                    );
                    if (result) {
                        callSideEffects(<number>status, chaynsErrorObject || undefined);
                        return;
                    }
                }
                // 2.2 statusHandlers[regex]
                if (statusHandlers && statusHandlers.size > 0) {
                    const handler = getStatusHandlerByStatusRegex(status, statusHandlers);
                    if (handler) {
                        console.debug(
                            ...colorLog.gray(`[HttpRequest<${processName}>]`), 'Resolving with regex statusHandler', {
                                status,
                                handler
                            }
                        );
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
                            callSideEffects(<number>status, chaynsErrorObject || undefined);
                            return;
                        }
                    }
                }

                console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Resolve with default response type', {
                    responseType,
                    fallback: ResponseType.Json
                });
                // 3. responseType
                callSideEffects(<number>status, chaynsErrorObject || undefined);
                const result = await resolveWithHandler(
                    responseType || ResponseType.Json,
                    response,
                    status,
                    processName,
                    resolve,
                    reject,
                    internalRequestGuid
                );
                if (result) return;
                console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Failed to resolve, using fallback');
                resolve(response);
            })();
        });
        if (waitCursor) {
            requestPromise.finally(hideWaitCursor);
        }
        return requestPromise;
    }

    /**
     * A fetch that uses dummy values to add more specific types for the expected json result
     */
    public typedFetch<TJson extends Record<string, any>>(dummyValue: TJson): <TOptions extends HttpRequestOptions>(
        address: string,
        config?: HttpRequestConfig,
        processName?: string,
        options?: TOptions
    ) => Promise<RequestResultWrapper<ExcludeEmptyOptions<TOptions,
        RequestResult<TOptions, TJson>> | ExcludeEmptyOptions<TDOptions, RequestResult<TDOptions, TJson>>, TJson>>;

    /**
     * A fetch that uses currying to add more specific types for the expected json result
     */
    public typedFetch<TJson extends Record<string, any> = Record<string, any>>(): <TOptions extends HttpRequestOptions>(
        address: string,
        config?: HttpRequestConfig,
        processName?: string,
        options?: TOptions
    ) => Promise<RequestResultWrapper<ExcludeEmptyOptions<TOptions,
        RequestResult<TOptions, TJson>> | ExcludeEmptyOptions<TDOptions, RequestResult<TDOptions, TJson>>, TJson>>;

    public typedFetch<TJson extends Record<string, any> = Record<string, any>>(): <TOptions extends HttpRequestOptions>(
        address: string,
        config?: HttpRequestConfig,
        processName?: string,
        options?: TOptions
    ) => Promise<RequestResultWrapper<ExcludeEmptyOptions<TOptions,
        RequestResult<TOptions, TJson>> | ExcludeEmptyOptions<TDOptions, RequestResult<TDOptions, TJson>>, TJson>> {
        return this.fetch as (<TOptions extends HttpRequestOptions>(
            address: string,
            config?: HttpRequestConfig,
            processName?: string,
            options?: TOptions
        ) => Promise<RequestResultWrapper<ExcludeEmptyOptions<TOptions,
            RequestResult<TOptions, TJson>> | ExcludeEmptyOptions<TDOptions, RequestResult<TDOptions, TJson>>, TJson>>);
    }

    /**
     * A fetch that uses dummy values to add more specific types for the expected json result
     * @param address
     * @param config
     * @param processName
     * @param options
     * @param jsonDummy
     */
    public dummyTypedFetch<TOptions extends HttpRequestOptions, TJson extends Record<string, any>>(
        address: string,
        config: HttpRequestConfig = {},
        processName = 'httpRequest',
        options: TOptions = {} as TOptions,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jsonDummy: TJson = {} as never
    ): Promise<RequestResultWrapper<ExcludeEmptyOptions<TOptions,
            RequestResult<TOptions, DefaultType<TJson, Record<string, any>>>>
        | ExcludeEmptyOptions<TDOptions, RequestResult<TDOptions, DefaultType<TJson, Record<string, any>>>>, TJson>> {
        return this.fetch(
            address,
            config,
            processName,
            options
        ) as Promise<RequestResultWrapper<ExcludeEmptyOptions<TOptions,
                RequestResult<TOptions, DefaultType<TJson, Record<string, any>>>>
            | ExcludeEmptyOptions<TDOptions,
            RequestResult<TDOptions, DefaultType<TJson, Record<string, any>>>>, TJson>>;
    }
}
