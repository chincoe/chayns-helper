// @ts-ignore
import logger from 'chayns-logger';
import colorLog from '../../utils/colorLog';
import stringToRegex, {regexRegex} from '../../utils/stringToRegex';
import ChaynsError, {ChaynsErrorObject} from './ChaynsError';
import getChaynsErrorCode from './getChaynsErrorCode';
import {chaynsErrorCodeRegex} from './isChaynsError';
import LogLevel, { LogLevelEnum } from './LogLevel';
import RequestError from './RequestError';
import ResponseType, { ResponseTypeEnum } from './ResponseType';

export const getMapKeys = (map: Map<string, any>) => {
    const result = [];
    const keys = map.keys();
    for (let i = 0; i < map.size; i++) {
        const {value} = keys.next();
        result.push(value);
    }
    return result;
};

/**
 * @param {number} status
 * @param {Object.<string|RegExp|number, function|LogLevel>} logConfig
 * @param {function} defaultFunction
 * @param {Response|Promise|Object} [chaynsErrorObject]
 * @returns {Promise<function(Object)>}
 */
export async function getLogFunctionByStatus(
    status: number,
    logConfig: Map<string, typeof LogLevelEnum| string>,
    defaultFunction: (data: object) => any,
    chaynsErrorObject?: ChaynsErrorObject
): Promise<(data: object, error?: Error) => any> {
    const logKeys: string[] = [];
    const mapKeys = getMapKeys(logConfig);
    logKeys.push(...(mapKeys.filter((k) => !/^[0-9]+$/.test(k)
        && !regexRegex.test(k)
        && chaynsErrorCodeRegex.test(k))));
    logKeys.push(...(mapKeys.filter((k) => !logKeys.includes(k))));

    let chaynsErrorCode: string | null = null;
    if (chaynsErrorObject) {
        chaynsErrorCode = await getChaynsErrorCode(chaynsErrorObject);
    }

    const levelKey = logKeys
        .find((key) => (
            (/^[\d]$/.test(key) && parseInt(key, 10) === status)
            || stringToRegex(key)
                .test(`${status}`)
            || (chaynsErrorCode && key === chaynsErrorCode)
            || (chaynsErrorCode && stringToRegex(key)
                .test(chaynsErrorCode))
        ));
    if (levelKey && logConfig.get(levelKey)) {
        switch (logConfig.get(levelKey)) {
            case LogLevel.info:
                return logger.info;
            case LogLevel.warning:
                return logger.warning;
            case LogLevel.error:
                return logger.error;
            case LogLevel.critical:
                return logger.critical;
            case LogLevel.none:
                // eslint-disable-next-line no-console
                return console.warn;
            default:
                console.error(...colorLog({
                    '[HttpRequest]': 'color: #aaaaaa',
                    // eslint-disable-next-line max-len
                    [`LogLevel '${logConfig.get(levelKey)}' for '${levelKey}' is not valid. Please use a valid log level.`]: ''
                }));
                return defaultFunction;
        }
    }
    return defaultFunction;
}

/**
 * @param status
 * @param statusHandlers
 * @returns {function(*=)|ResponseType|null}
 */
export function getStatusHandlerByStatusRegex(status: number, statusHandlers: Map<string, (response: Response) => any>): ((value?: any) => any)|ResponseType|null|undefined {
    const keys = getMapKeys(statusHandlers);
    for (let i = 0; i < keys.length; i += 1) {
        const regExp = stringToRegex(keys[i]);
        if (regExp.test(status?.toString())
            && (chayns.utils.isFunction(statusHandlers.get(keys[i]))
                // @ts-ignore
                || Object.values(ResponseType).includes(statusHandlers.get(keys[i])))
        ) {
            return statusHandlers.get(keys[i]);
        }
    }
    return null;
}

export const jsonResolve = async (response: Response, processName: string, resolve: (value: any) => void, internalRequestGuid: string | null = null) : Promise<void> => {
    const {status} = response;
    try {
        resolve(await response.json());
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting JSON body failed on Status ${status} on ${processName}`,
            data: {
                internalRequestGuid
            }
        }, err);
        // eslint-disable-next-line no-console
        console.warn(...colorLog({
            '[HttpRequest]': 'color: #aaaaaa',
            // eslint-disable-next-line max-len
            [`Getting JSON body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`]: ''
        }), {statusHandlers: {[status]: ResponseType.None}}, '\n', err);
        resolve(null);
    }
};

export const blobResolve = async (response: Response, processName: string, resolve: (value: any) => void, internalRequestGuid: string | null = null) : Promise<void> => {
    const {status} = response;
    try {
        resolve(await response.blob());
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting BLOB body failed on Status ${status} on ${processName}`,
            data: {
                internalRequestGuid
            }
        }, err);
        // eslint-disable-next-line no-console
        console.warn(...colorLog({
            '[HttpRequest]': 'color: #aaaaaa',
            // eslint-disable-next-line max-len
            [`Getting BLOB body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`]: ''
        }), {statusHandlers: {[status]: ResponseType.None}}, '\n', err);
        resolve(null);
    }
};

export const textResolve = async (response: Response, processName: string, resolve: (value: any) => void, internalRequestGuid: string | null = null) : Promise<void> => {
    const {status} = response;
    try {
        resolve(await response.text());
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting text body failed on Status ${status} on ${processName}`,
            data: {internalRequestGuid}
        }, err);
        // eslint-disable-next-line no-console
        console.warn(...colorLog({
            '[HttpRequest]': 'color: #aaaaaa',
            // eslint-disable-next-line max-len
            [`Getting text body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`]: ''
        }), {statusHandlers: {[status]: ResponseType.None}}, '\n', err);
        resolve(null);
    }
};

export const objectResolve = async (response: Response, processName: string, resolve: (value: any) => void, internalRequestGuid: string | null = null) : Promise<void> => {
    const {status} = response;
    try {
        resolve({
            status,
            data: await response.json()
        });
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting JSON body for Object failed on Status ${status} on ${processName}`,
            data: {internalRequestGuid}
        }, err);
        // eslint-disable-next-line no-console
        console.warn(...colorLog({
            '[HttpRequest]': 'color: #aaaaaa',
            // eslint-disable-next-line max-len
            [`Getting JSON body for Object failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`]: ''
        }), {statusHandlers: {[status]: ResponseType.None}}, '\n', err);
        resolve({
            status,
            data: null
        });
    }
};

export async function resolveWithHandler(
    handler: typeof ResponseTypeEnum | string | ((response: Response) => any),
    response: Response,
    status: number,
    processName: string,
    resolve: (value?: any) => any,
    reject: (value?: any) => any,
    internalRequestGuid: string,
    chaynsErrorObject: ChaynsErrorObject | null = null,
): Promise<boolean> {
    if (chayns.utils.isFunction(handler)) {
        // eslint-disable-next-line no-await-in-loop
        // @ts-ignore
        resolve(await handler(chaynsErrorObject ?? response));
        return true;
    }
    // @ts-ignore
    if (Object.values(ResponseType).includes(handler)) {
        switch (handler) {
            case ResponseType.Json:
                // eslint-disable-next-line no-await-in-loop
                await jsonResolve(response, processName, resolve, internalRequestGuid);
                return true;
            case ResponseType.Blob:
                // eslint-disable-next-line no-await-in-loop
                await blobResolve(response, processName, resolve, internalRequestGuid);
                return true;
            case ResponseType.Object:
                // eslint-disable-next-line no-await-in-loop
                await objectResolve(response, processName, resolve, internalRequestGuid);
                return true;
            case ResponseType.Text:
                // eslint-disable-next-line no-await-in-loop
                await textResolve(response, processName, resolve, internalRequestGuid);
                return true;
            case ResponseType.None:
                resolve();
                return true;
            case ResponseType.Error:
                const error = chaynsErrorObject
                    ? new ChaynsError(chaynsErrorObject, processName, status)
                    : new RequestError(`Status ${status} on ${processName}`, status);
                console.error(...colorLog({
                    '[HttpRequest]': 'color: #aaaaaa',
                    'ResponseType \'error\':': ''
                }), error);
                reject(error);
                return true;
            case ResponseType.Response:
            default:
                resolve(response);
                return true;
        }
    }
    logger.warning({
        message: `[HttpRequest] Invalid handler '${handler}' on status ${status} on ${processName}`,
        data: {
            handler,
            status,
            internalRequestGuid,
            processName
        }
    });
    return false;
}

export const mergeOptions = (obj1: { [key: string]: any } | Map<string, any>, obj2: { [key: string]: any }): Map<string, any> => {
    const result: Map<string, any> = obj1 instanceof Map ? obj1 : new Map();
    if (!(obj1 instanceof Map)) {
        const keys1 = Object.keys(obj1);
        for (let i = 0; i < keys1.length; i++) {
            result.set(keys1[i], obj1[keys1[i]]);
        }
    }
    const keys2 = Object.keys(obj2);
    for (let i = 0; i < keys2.length; i++) {
        if (!result.get(keys2[i])) {
            result.set(keys2[i], obj2[keys2[i]]);
        }
    }
    return result;
};
