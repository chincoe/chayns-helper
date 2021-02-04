// @ts-expect-error
import logger from 'chayns-logger';

export const chaynsErrorCodeRegex = /^[a-zA-Z0-9_]+\/[a-zA-Z0-9/_]+$/;

/**
 * Check if object is a chayns error object
 * @param obj
 */
export function isChaynsErrorObject(obj: {[key: string]: any}): boolean {
    return !!obj
        && Object.prototype.toString.call(obj) === "[object Object]"
        && Object.hasOwnProperty.call(obj, 'displayMessage')
        && Object.hasOwnProperty.call(obj, 'errorCode')
        && Object.hasOwnProperty.call(obj, 'requestId')
        && typeof (obj?.errorCode) === 'string'
        && typeof (obj?.displayMessage) === 'string'
        && chaynsErrorCodeRegex.test(obj.errorCode);
}

/**
 * Check if response has a chayns error object body
 * @param value
 */
export default async function isChaynsError(value: any): Promise<boolean> {
    try {
        if (value instanceof Response) {
            const response = value.clone();
            let obj: {[key: string]: any} = {};
            try {
                obj = await response.json();
            } catch(e) { /* ignored */ }
            return isChaynsErrorObject(obj);
        }
        if (chayns.utils.isPromise(value)) {
            const result = await Promise.resolve(value);
            return isChaynsError(result);
        }
        return isChaynsErrorObject(value);
    } catch (e) {
        logger.warning({
            message: '[IsChaynsError] Failed to read value',
            data: {
                value
            }
        });
        return false;
    }
}
