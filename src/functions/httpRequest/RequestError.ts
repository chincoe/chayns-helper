/**
 * Custom error for error statusCodes or other errors during a httpRequest
 * @public
 * @class
 */
export default class RequestError extends Error {
    statusCode = 0;

    /**
     * @param {string} message - Error message
     * @param {number} statusCode - Response status code
     */
    constructor(message, statusCode) {
        super(message);
        this.name = `HttpRequestError${statusCode}`;
        this.statusCode = statusCode;
        this.stack = `${this.name}: ${this.message}`;
    }
}
