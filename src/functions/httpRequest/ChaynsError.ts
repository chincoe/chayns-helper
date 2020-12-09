import {isChaynsErrorObject} from './isChaynsError';
import RequestError from './RequestError';


export interface ChaynsErrorObject {
    displayMessage: string,
    errorCode: string;
    parameters: { [key: string]: any };
    requestId: string;
    showDialog?: boolean;
}

/**
 * @public
 * @class
 */
export default class ChaynsError extends RequestError {
    displayMessage: string = '';

    errorCode: string = '';

    parameters: object = {};

    requestId: string = '';

    static async getChaynsErrorObject(value: object | Response | Promise<any>): Promise<ChaynsErrorObject | null> {
        if (value instanceof Response) {
            const response = value.clone();
            let obj: {[key: string]: any}|ChaynsErrorObject = {};
            try {
                obj = await response.json();
            } catch(e) { /* ignored */ }
            if (isChaynsErrorObject(obj)) {
                return <ChaynsErrorObject>obj;
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

    constructor(error: ChaynsErrorObject, processName: string, status: number) {
        super(`Status ${status} with ChaynsError '${error?.errorCode}' on ${processName}`, status);
        this.displayMessage = error.displayMessage;
        this.errorCode = error.errorCode;
        this.parameters = error.parameters;
        this.requestId = error.requestId;
        this.name = `ChaynsError/${error.errorCode}`;
        this.stack = `${this.name}: ${this.message}`;
    }
}
