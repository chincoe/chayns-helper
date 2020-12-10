/**
 * httpRequest response type. Default: json
 */
export enum ResponseTypeEnum {
    Json = 'json',
    Blob = 'blob',
    Response = 'response',
    Object = 'object',
    Text = 'text',
    None = 'none',
    Error = 'error',
}

/**
 * httpRequest response type. Default: json
 */
const ResponseType = {
    Json: 'json',
    Blob: 'blob',
    Response: 'response',
    Object: 'object',
    Text: 'text',
    None: 'none',
    Error: 'error',
}

export default ResponseType;
