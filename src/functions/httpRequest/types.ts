import { ResponseType, StatusResponse } from './ResponseType';
import { ChaynsErrorObject } from './ChaynsError';
import HttpStatusCode from './HttpStatusCodes';
import LogLevel from './LogLevel';
import { JsonSettings } from '../getJsonSettings';
import HttpMethod from './HttpMethod';

/// HttpClient input types

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

/// HttpClient output types

export type ResponseTypeResult<T, TJson extends Record<string, any>> = T extends ResponseType.Json
    ? TJson
    : T extends ResponseType.Blob
        ? Blob
        : T extends ResponseType.Binary
            ? ArrayBuffer
            : T extends ResponseType.Response
                ? Response
                : T extends ResponseType.Text
                    ? string
                    : T extends ResponseType.None
                        ? undefined
                        : T extends ResponseType.ThrowError
                            ? never
                            : T extends (ResponseType.JsonWithStatus | ResponseType.Object)
                                ? StatusResponse<TJson>
                                : T extends ResponseType.BlobWithStatus
                                    ? StatusResponse<Blob>
                                    : T extends ResponseType.TextWithStatus
                                        ? StatusResponse<string>
                                        : T extends ResponseType.NoneWithStatus
                                            ? StatusResponse<undefined>
                                            : T extends ResponseType.BinaryWithStatus
                                                ? StatusResponse<ArrayBuffer>
                                                : any

export type HandlerUnion<T extends Record<string, ResponseType
    | ((response: Response & ChaynsErrorObject) => unknown)>
    | Map<string, ResponseType | ((response: Response & ChaynsErrorObject) => unknown)>
    | undefined,
    TJson extends Record<string, any>> = {
    [K in keyof T]: T extends Record<string, any>
        ? T[K] extends ResponseType ? ResponseTypeResult<T[K], TJson>
            : T[K] extends (...args: unknown[]) => infer R
                ? R : never
        : any
}[keyof T]

export type DefaultType<T extends Record<string, unknown>, TDefault> = [T] extends [never] ? TDefault : T;
export type ExcludeEmptyOptions<T, TNotEmpty> = T extends Record<string, never>
    ? never
    : undefined extends T
        ? never
        : Partial<HttpRequestOptions> extends T
            ? never
            : TNotEmpty;
export type RequestResultWrapper<T, TJson = Record<string, any>> = [T] extends [never]
    ? ResponseTypeResult<ResponseType.Json, TJson>
    : T;

export type RequestResult<T extends HttpRequestOptions, TJson extends Record<string, any> = Record<string, any>> =
    T['responseType'] extends ResponseType
        ? T['statusHandlers'] extends Required<HttpRequestOptions>['statusHandlers']
        ? T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? (HandlerUnion<T['statusHandlers'], TJson>
                | HandlerUnion<T['errorHandlers'], TJson>
                | ResponseTypeResult<T['responseType'], TJson>)
            : HandlerUnion<T['statusHandlers'], TJson> | ResponseTypeResult<T['responseType'], TJson>
        : T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerUnion<T['errorHandlers'], TJson> | ResponseTypeResult<T['responseType'], TJson>
            : ResponseTypeResult<T['responseType'], TJson>
        : T['statusHandlers'] extends Required<HttpRequestOptions>['statusHandlers']
        ? T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerUnion<T['statusHandlers'], TJson> | HandlerUnion<T['errorHandlers'], TJson>
            : HandlerUnion<T['statusHandlers'], TJson>
        : T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerUnion<T['errorHandlers'], TJson>
            : any;

export type CombinedRequestResult<TOptions, TDOptions, TJson = Record<string, any>> =
    RequestResultWrapper<ExcludeEmptyOptions<TOptions, RequestResult<TOptions, TJson>>
        | ExcludeEmptyOptions<TDOptions, RequestResult<TDOptions, TJson>>, TJson>
