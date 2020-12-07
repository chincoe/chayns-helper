// @ts-ignore
import logger from 'chayns-logger';
import { isChaynsErrorObject } from './isChaynsError';
import {ChaynsErrorObject} from "./ChaynsError";

function getChaynsErrorCodeFromObject(value: ChaynsErrorObject): string|null {
    if (!isChaynsErrorObject(value)) return null;
    if (chayns.utils.isObject(value) && Object.hasOwnProperty.call(value, 'errorCode')) {
        return value.errorCode;
    }
    return null;
}

/**
 * @param {Response|Promise|Object} value
 * @returns {Promise<null>}
 */
export default async function getChaynsErrorCode(value: any): Promise<string|null> {
    try {
        if (value instanceof Response) {
            const response = value.clone();
            const obj = await response.json();
            return getChaynsErrorCodeFromObject(obj);
        }
        if (chayns.utils.isPromise(value)) {
            const result = await Promise.resolve(value);
            return getChaynsErrorCode(result);
        }
        return getChaynsErrorCodeFromObject(value);
    } catch (e) {
        logger.warning({
            message: '[GetChaynsErrorCode] Failed to read value',
            data: {
                value
            }
        });
        return null;
    }
}
