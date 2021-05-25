// noinspection JSUnusedGlobalSymbols

import { ResponseType, StatusResponse } from './ResponseType';
import { HttpRequestOptions } from './httpRequest';
import RequestError from './RequestError';
import ChaynsError from './ChaynsError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type ResponseTypeResult<T> = T extends ResponseType.Json
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? Record<string, any>
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
                            ? (RequestError & ChaynsError)
                            : T extends (ResponseType.JsonWithStatus | ResponseType.Object)
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ? StatusResponse<Record<string, any>>
                                : T extends ResponseType.BlobWithStatus
                                    ? StatusResponse<Blob>
                                    : T extends ResponseType.TextWithStatus
                                        ? StatusResponse<string>
                                        : T extends ResponseType.NoneWithStatus
                                            ? StatusResponse<undefined>
                                            : T extends ResponseType.BinaryWithStatus
                                                ? StatusResponse<ArrayBuffer>
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                : any

export type HandlerIntersection<T extends Record<string, ResponseType | ((response: Response) => unknown)>
    | Map<string, ResponseType | ((response: Response) => unknown)> | undefined> = UnionToIntersection<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: T extends Record<string, any>
        ? T[K] extends ResponseType ? ResponseTypeResult<T[K]>
            : T[K] extends (...args: unknown[]) => infer R
                ? R : never
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : any
}[keyof T]>

export type RequestResult<T extends HttpRequestOptions> = T['responseType'] extends ResponseType
    ? T['statusHandlers'] extends Required<HttpRequestOptions>['statusHandlers']
        ? T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? (HandlerIntersection<T['statusHandlers']>
                & HandlerIntersection<T['errorHandlers']>
                & ResponseTypeResult<T['responseType']>)
            : HandlerIntersection<T['statusHandlers']> & ResponseTypeResult<T['responseType']>
        : T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerIntersection<T['errorHandlers']> & ResponseTypeResult<T['responseType']>
            : ResponseTypeResult<T['responseType']>
    : T['statusHandlers'] extends Required<HttpRequestOptions>['statusHandlers']
        ? T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerIntersection<T['statusHandlers']> & HandlerIntersection<T['errorHandlers']>
            : HandlerIntersection<T['statusHandlers']>
        : T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerIntersection<T['errorHandlers']>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            : any;
