import logger from '../../utils/requireChaynsLogger';
import { isChaynsErrorObject } from './isChaynsError';
import { ChaynsErrorObject } from './ChaynsError';

function getChaynsErrorCodeFromObject(value: ChaynsErrorObject): string | null {
    if (!isChaynsErrorObject(value)) return null;
    if (Object.prototype.toString.call(value) === '[object Object]'
        && Object.hasOwnProperty.call(value, 'errorCode')
    ) {
        return value.errorCode;
    }
    return null;
}

/**
 * Get the chayns error code from a Response or errorObject
 * @param value
 * @returns
 */
export default async function getChaynsErrorCode(value: unknown): Promise<string | null> {
    try {
        if (value instanceof Response) {
            const response = value.clone();
            let obj: Record<string, unknown> | ChaynsErrorObject = {};
            try {
                obj = await response.json();
            } catch (e) { /* ignored */ }
            return getChaynsErrorCodeFromObject(obj as ChaynsErrorObject);
        }
        if (value && typeof (value as Promise<unknown>)?.then === 'function') {
            const result = await Promise.resolve(value);
            return getChaynsErrorCode(result);
        }
        return getChaynsErrorCodeFromObject(value as ChaynsErrorObject);
    } catch (e) {
        logger.warning({
            message: '[GetChaynsErrorCode] Failed to read value',
            data: {
                value
            },
            section: '[chayns-helper]getChaynsErrorCode.js'
        });
        return null;
    }
}
