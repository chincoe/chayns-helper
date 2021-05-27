import { HttpRequestOptions } from './HttpClient';
import { ResponseType, StatusResponse } from './ResponseType';
import RequestError from './RequestError';
import ChaynsError, { ChaynsErrorObject } from './ChaynsError';

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type ResponseTypeResult<T, TJson extends Record<string, any>> = T extends ResponseType.Json
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: T extends Record<string, any>
        ? T[K] extends ResponseType ? ResponseTypeResult<T[K], TJson>
            : T[K] extends (...args: unknown[]) => infer R
                ? R : never
        : any
}[keyof T]

export type RequestResult<T extends HttpRequestOptions, TJson extends Record<string, any> = Record<string, any>> = T['responseType'] extends ResponseType
    ? T['statusHandlers'] extends Required<HttpRequestOptions>['statusHandlers']
        ? T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? (HandlerUnion<T['statusHandlers'], TJson>
                & HandlerUnion<T['errorHandlers'], TJson>
                & ResponseTypeResult<T['responseType'], TJson>)
            : HandlerUnion<T['statusHandlers'], TJson> & ResponseTypeResult<T['responseType'], TJson>
        : T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerUnion<T['errorHandlers'], TJson> & ResponseTypeResult<T['responseType'], TJson>
            : ResponseTypeResult<T['responseType'], TJson>
    : T['statusHandlers'] extends Required<HttpRequestOptions>['statusHandlers']
        ? T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerUnion<T['statusHandlers'], TJson> & HandlerUnion<T['errorHandlers'], TJson>
            : HandlerUnion<T['statusHandlers'], TJson>
        : T['errorHandlers'] extends Required<HttpRequestOptions>['errorHandlers']
            ? HandlerUnion<T['errorHandlers'], TJson>
            : any;
