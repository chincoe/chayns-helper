import logger from '../../utils/requireChaynsLogger';
import jsonLog from '../../utils/jsonLog';
import { ChaynsErrorObject } from './ChaynsError';

export const chaynsErrorCodeRegex = /^[a-zA-Z0-9_]+\/[a-zA-Z0-9/_]+$/;

/**
 * Check if object is a chayns error object
 * @param obj
 */
export function isChaynsErrorObject(obj: Record<string, unknown> | ChaynsErrorObject): boolean {
    return !!obj
        && Object.prototype.toString.call(obj) === '[object Object]'
        && Object.hasOwnProperty.call(obj, 'errorCode')
        && Object.hasOwnProperty.call(obj, 'requestId')
        && typeof (obj?.errorCode) === 'string'
        && chaynsErrorCodeRegex.test(obj.errorCode);
}

/**
 * Check if response has a chayns error object body
 * @param value
 */
export default async function isChaynsError(value: unknown): Promise<boolean> {
    try {
        if (value instanceof Response) {
            const response = value.clone();
            let obj: Record<string, unknown> = {};
            try {
                obj = await response.json();
            } catch (e) { /* ignored */ }
            return isChaynsErrorObject(obj);
        }
        if (value && typeof (<Promise<unknown>>value)?.then === 'function') {
            const result = await Promise.resolve(value);
            return isChaynsError(result);
        }
        return isChaynsErrorObject(value as Record<string, unknown>);
    } catch (e) {
        logger.warning(jsonLog({
            message: '[IsChaynsError] Failed to read value',
            data: {
                value
            },
            section: '[chayns-helper]isChaynsError.js'
        }));
        return false;
    }
}
