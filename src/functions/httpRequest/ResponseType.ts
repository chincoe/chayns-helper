/**
 * httpRequest response type. Default: json
 */
const ResponseType: {
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
        Text: 'status_text',
        None: 'status_none'
    }
} = {
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
        Text: 'status_text',
        None: 'status_none'
    }
}

export type ResponseTypeValue = (typeof ResponseType)[(keyof Omit<typeof ResponseType, 'Status'>)]
    | (typeof ResponseType.Status)[(keyof typeof ResponseType.Status)] | string;

export const ResponseTypeList: Array<ResponseTypeValue> =
    [
        ...(Object.values(ResponseType).slice(0, -1) as Array<ResponseTypeValue>),
        ...(Object.values(ResponseType.Status) as Array<ResponseTypeValue>)
    ]

export default ResponseType;
