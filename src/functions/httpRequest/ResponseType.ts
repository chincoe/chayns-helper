/**
 * httpRequest response type. Default: json
 */
const enum ResponseType {
    Json = 'json',
    Blob = 'blob',
    Response = 'response',
    Object = 'object',
    Text = 'text',
    None = 'none',
    Error = 'error',
}

export default ResponseType;
