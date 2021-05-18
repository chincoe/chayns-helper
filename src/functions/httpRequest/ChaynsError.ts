import { isChaynsErrorObject } from './isChaynsError';
import RequestError from './RequestError';

export interface ChaynsErrorObject {
    displayMessage: string,
    errorCode: string;
    parameters: Record<string, unknown>;
    requestId: string;
    showDialog?: boolean;
}

/**
 * Custom error class for ChaynsErrors
 * @public
 * @class
 */
export default class ChaynsError extends RequestError {
    displayMessage = '';

    errorCode = '';

    parameters: Record<string, unknown> = {};

    requestId = '';

    errorObject: ChaynsErrorObject;

    static async getChaynsErrorObject(
        value: Record<string, unknown> | Response | Promise<unknown>
    ): Promise<ChaynsErrorObject | null> {
        if (value instanceof Response) {
            const response = value.clone();
            let obj: Record<string, unknown> | ChaynsErrorObject = {};
            try {
                obj = await response.json();
            } catch (e) { /* ignored */ }
            if (isChaynsErrorObject(obj)) {
                return <ChaynsErrorObject>obj;
            }
        }
        if (value && typeof (<Promise<unknown>>value)?.then === 'function') {
            const result = await Promise.resolve(value);
            return ChaynsError.getChaynsErrorObject(result as Promise<unknown>);
        }
        if (isChaynsErrorObject(value)) {
            return value as unknown as ChaynsErrorObject;
        }
        return null;
    }

    constructor(error: ChaynsErrorObject, processName: string, status: number) {
        super(`Status ${status} with ChaynsError '${error?.errorCode}' on ${processName}`, status);
        this.errorObject = error;
        this.displayMessage = error.displayMessage;
        this.errorCode = error.errorCode;
        this.parameters = error.parameters;
        this.requestId = error.requestId;
        this.name = `ChaynsError/${error.errorCode}`;
        this.stack = `${this.name}: ${this.message}`;
    }
}
