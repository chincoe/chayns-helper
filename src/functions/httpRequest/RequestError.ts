/**
 * Custom error for error statusCodes or rerender errors during a httpRequest
 * @public
 * @class
 */
export default class RequestError extends Error {
    statusCode = 0;

    /**
     * @param message - Error message
     * @param statusCode - Response status code
     */
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = `HttpRequestError${statusCode}`;
        this.statusCode = statusCode;
        this.stack = `${this.name}: ${this.message}`;
    }
}
