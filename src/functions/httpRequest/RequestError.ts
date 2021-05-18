/**
 * Custom error for error statusCodes or other errors during a httpRequest
 * @public
 * @class
 */
export default class RequestError extends Error {
    statusCode = 0;

    status = 0;

    /**
     * @param message - Error message
     * @param statusCode - Response status code
     */
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = `HttpRequestError${statusCode}`;
        this.statusCode = statusCode;
        this.status = statusCode;
        this.stack = `${this.name}: ${this.message}`;
    }
}
