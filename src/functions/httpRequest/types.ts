// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { ResponseType, StatusResponse } from './ResponseType';
import { HttpRequestOptions } from './httpRequest';
import RequestError from './RequestError';
import ChaynsError from './ChaynsError';

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type HandlerIntersection<T extends Record<string, ResponseType | ((response: Response) => unknown)>
    | Map<string, ResponseType | ((response: Response) => unknown)> | undefined> = UnionToIntersection<{
    [K in keyof T]: T extends Record<string, any> ? T[K] extends ResponseType.Json
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? Record<string, any> : T[K] extends ResponseType.Blob
            ? Blob : T[K] extends ResponseType.Binary
                ? ArrayBuffer : T[K] extends ResponseType.Response
                    ? Response : T[K] extends ResponseType.Text
                        ? string : T[K] extends ResponseType.None
                            ? undefined : T[K] extends ResponseType.ThrowError
                                ? (RequestError | ChaynsError)
                                : T[K] extends (ResponseType.JsonWithStatus | ResponseType.Object)
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    ? StatusResponse<Record<string, any>>
                                    : T[K] extends ResponseType.BlobWithStatus
                                        ? StatusResponse<Blob>
                                        : T[K] extends ResponseType.TextWithStatus
                                            ? StatusResponse<string>
                                            : T[K] extends ResponseType.NoneWithStatus
                                                ? StatusResponse<undefined>
                                                : T[K] extends ResponseType.BinaryWithStatus
                                                    ? StatusResponse<ArrayBuffer>
                                                    : T[K] extends (...args: unknown[]) => infer R
                                                        ? R : never
        : never
}[keyof T]>

export type RequestResult<T extends HttpRequestOptions> = HandlerIntersection<T['statusHandlers']> &
    HandlerIntersection<T['errorHandlers']>
