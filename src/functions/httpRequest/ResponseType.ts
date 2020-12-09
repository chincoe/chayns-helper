/**
 * httpRequest response type. Default: json
 */
export enum ResponseType {
    Json = 'json',
    Blob = 'blob',
    Response = 'response',
    Object = 'object',
    Text = 'text',
    None = 'none',
    Error = 'error',
}

export default ResponseType;
