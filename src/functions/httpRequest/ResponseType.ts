/**
 * httpRequest response type. Default: json
 */
const ResponseType = {
    Json: 'json',
    Blob: 'blob',
    Response: 'response',
    Text: 'text',
    Object: 'object',
    None: 'none',
    ThrowError: 'error',
    Status: {
        Json: 'status_json',
        Blob: 'status_blob',
        Text: 'status_text'
    }
}

export type ResponseTypeValue =
    ResponseType
    | string
    | 'json'
    | 'blob'
    | 'response'
    | 'text'
    | 'none'
    | 'error'
    | 'status_json'
    | 'status_blob'
    | 'status_text'

export const ResponseTypeList = [...Object.values(ResponseType).slice(0, -1), ...Object.values(ResponseType.Status)]

export default ResponseType;
