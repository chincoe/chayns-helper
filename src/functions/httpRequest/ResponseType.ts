/**
 * httpRequest response type. Default: json
 */
const ResponseType = {
    Json: 'json',
    Blob: 'blob',
    Binary: 'binary',
    Response: 'response',
    Text: 'text',
    Object: 'object',
    None: 'none',
    ThrowError: 'error',
    Status: {
        Json: 'status_json',
        Blob: 'status_blob',
        Text: 'status_text',
        None: 'status_none',
        Binary: 'status_binary'
    }
}

export type ResponseTypeValue =
    ResponseType
    | string
    | 'json'
    | 'blob'
    | 'binary'
    | 'response'
    | 'text'
    | 'none'
    | 'error'
    | 'status_json'
    | 'status_blob'
    | 'status_text'
    | 'status_none'
    | 'status_binary'

export const ResponseTypeList = [...Object.values(ResponseType).slice(0, -1), ...Object.values(ResponseType.Status)]

export default ResponseType;
