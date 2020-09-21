/**
 * httpRequest response type. Default: json
 * @type {Object}
 * @property {string} Response - Get the Response Object
 * @property {string} Blob - Get response.blob()
 * @property {string} Json - Get response.json()
 * @property {string} Object - Get status and json as Object {status: number, data: Object}
 * @property {string} Text - Get response.text()
 * @property {string} None - Get null
 */
const ResponseType = Object.freeze({
    Json: 'json',
    Blob: 'blob',
    Response: 'response',
    Object: 'object',
    Text: 'text',
    None: 'none'
});

export default ResponseType;
