// @ts-ignore
import logger from 'chayns-logger';

export const chaynsErrorCodeRegex = /^[a-zA-Z0-9_]+\/[a-zA-Z0-9/_]+$/;

/**
 * @param {Object} obj
 * @returns {boolean}
 */
export function isChaynsErrorObject(obj: object): boolean {
    return !!obj
        && chayns.utils.isObject(obj)
        && Object.hasOwnProperty.call(obj, 'displayMessage')
        && Object.hasOwnProperty.call(obj, 'errorCode')
        && Object.hasOwnProperty.call(obj, 'requestId')
        // @ts-ignore
        && chayns.utils.isString(obj?.errorCode)
        // @ts-ignore
        && chayns.utils.isString(obj?.displayMessage)
        // @ts-ignore
        && chaynsErrorCodeRegex.test(obj.errorCode);
}

/**
 * @param {Promise|Response|Object} value
 * @returns {Promise<boolean>}
 */
export default async function isChaynsError(value: any): Promise<boolean> {
    try {
        if (value instanceof Response) {
            const response = value.clone();
            const obj = await response.json();
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
