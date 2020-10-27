export const defaultConfig = {
    options: {},
    address: '',
    config: {}
};

/**
 * Set defaults for httpRequest
 * @param {string} [address=''] - Address of the request. Address will be appended to this default if it doesn't start
 *     with a protocol but starts with a '/'.
 * @param {Object} [config={}] - Fetch config
 * @param {HttpMethod|string} [config.method='GET'] - HttpMethod
 * @param {Object} [config.headers] - Additional HttpHeaders
 * @param {boolean} [config.useChaynsAuth] - Add user token as authorization if available
 * @param {*} [config.body] - Body of the request
 * @param {*} [config.signal] - Signal to abort request while running, use with RTK thunks
 * @param {string} [config.cache]
 * @param {string} [config.referrer]
 * @param {string} [config.referrerPolicy]
 * @param {string} [config.mode]
 * @param {string} [config.redirect]
 * @param {string} [config.integrity]
 * @param {boolean} [config.keepalive]
 * @param {Window} [config.window]
 * @param {Object} [options={}] - Additional options for the request
 * @param {ResponseType|string} [options.responseType=null] - type of response that is expected
 * @param {boolean|number[]} [options.ignoreErrors=false] - Don't throw errors for this request if true or if this
 *     array contains the response status. Return null on error instead. Errors will still be logged as usual.
 * @param {Object.<string,LogLevel>} [options.logConfig={}] - Define the logLevel for these status codes. Can use
 *     status code or regex string as key. Values must be info|warning|error|critical|none.
 * @param {boolean} [options.stringifyBody=true] - Call JSON.stringify(body) for the body passed to this function
 * @param {Object} [options.additionalLogData={}] - Additional data to be logged with this request
 * @param {boolean} [options.autoRefreshToken=true] - Automatically try to refresh the token once if it expired
 * @param {Object} [options.statusHandlers={}] - Handle response for specific status codes
 * Usage: { [statusCode|regexString] : (response) => { my code }, ... }
 *    OR: { [statusCode|regexString] : responseType }
 *     - handler always receives entire response as parameter, not just the body
 *     - value returned from handler is returned as result of the request
 *     - handler can be async and will be awaited
 *     Response handling priorities:
 *      1. statusHandlers[status]
 *      2. statusHandlers[regex]
 *      3. response type
 * @param {Object.<string|RegExp, ResponseType|statusCodeHandler|function(Response)>} [options.errorHandlers={}] -
 *     chayns error handler for specific ChaynsErrors
 * @param {Object.<string|RegExp, string|function>} [options.replacements={}] - replacements for request url
 * @public
 */
export default function setRequestDefaults(address, config, options) {
    defaultConfig.address = address || '';
    defaultConfig.config = config || {};
    defaultConfig.options = options || {};
}
