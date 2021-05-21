import HttpStatusCode from './HttpStatusCodes';

export interface StatusResponse<T> {
    status: -1 | HttpStatusCode[keyof HttpStatusCode] | number,
    data?: T
}

/**
 * httpRequest response type. Default: json
 */
export enum ResponseType {
    Json = 'json',
    Blob = 'blob',
    Binary = 'binary',
    Response = 'response',
    Text = 'text',
    Object = 'object',
    None = 'none',
    ThrowError = 'error',
    JsonWithStatus = 'status_json',
    BlobWithStatus = 'status_blob',
    TextWithStatus = 'status_text',
    NoneWithStatus = 'status_none',
    BinaryWithStatus = 'status_binary'
}

export const ResponseTypeList: Array<ResponseType> = (Object.values(ResponseType).slice(0, -1) as Array<ResponseType>);
