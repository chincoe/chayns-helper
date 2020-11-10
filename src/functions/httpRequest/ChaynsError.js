import { isChaynsErrorObject } from './isChaynsError';
import RequestError from './RequestError';

/**
 * @typedef {{displayMessage: string, errorCode: string, parameters: Object, requestId: string}} chaynsErrorObject
 */

/**
 * @public
 * @class
 */
export default class ChaynsError extends RequestError {
    displayMessage = '';

    errorCode = '';

    parameters = {};

    requestId = '';

    /**
     * @param {Object|Response|Promise} value
     * @returns {Promise<chaynsErrorObject|null>}
     */
    static async getChaynsErrorObject(value) {
        if (value instanceof Response) {
            const response = value.clone();
            const obj = await response.json();
            if (isChaynsErrorObject(obj)) {
                return obj;
            }
        }
        if (chayns.utils.isPromise(value)) {
            const result = await Promise.resolve(value);
            return ChaynsError.getChaynsErrorObject(result);
        }
        if (isChaynsErrorObject(value)) {
            return value;
        }
        return null;
    }

    /**
     * @param {chaynsErrorObject} error
     * @param {string} processName
     * @param {number} status
     */
    constructor(error, processName, status) {
        super(`[ChaynsError] Status ${status} with error '${error?.errorCode}' on ${processName}`, status);
        this.displayMessage = error.displayMessage;
        this.errorCode = error.errorCode;
        this.parameters = error.parameters;
        this.requestId = error.requestId;
        this.name = `ChaynsError/${error.errorCode}`;
    }
}
