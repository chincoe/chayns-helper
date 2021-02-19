// @ts-expect-error
import logger from 'chayns-logger';
import colorLog from '../../utils/colorLog';
import stringToRegex, { regexRegex } from '../../utils/stringToRegex';
import ChaynsError, { ChaynsErrorObject } from './ChaynsError';
import getChaynsErrorCode from './getChaynsErrorCode';
import { chaynsErrorCodeRegex } from './isChaynsError';
import LogLevel, { LogLevelType } from './LogLevel';
import RequestError from './RequestError';
import ResponseType, { ResponseTypeList, ResponseTypeValue } from './ResponseType';

export const getMapKeys = (map: Map<string, any>) => {
    const result = [];
    const keys = map.keys();
    for (let i = 0; i < map.size; i++) {
        const { value } = keys.next();
        result.push(value);
    }
    return result;
};

export async function getLogFunctionByStatus(
    status: number,
    logConfig: Map<string, LogLevelType>,
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
                return console.warn;
            default:
                console.error(
                    ...colorLog.gray('[HttpRequest]'),
                    `LogLevel '${logConfig.get(levelKey)}' for '${levelKey}' is invalid. Please use a valid log level.`
                );
                return defaultFunction;
        }
    }
    return defaultFunction;
}

export function getStatusHandlerByStatusRegex(
    status: number,
    statusHandlers: Map<string, (response: Response) => any>
): ((value?: any) => any) | ResponseType | null | undefined {
    const keys = getMapKeys(statusHandlers);
    for (let i = 0; i < keys.length; i += 1) {
        const regExp = stringToRegex(keys[i]);
        if (regExp.test(status?.toString())
            && (typeof (statusHandlers.get(keys[i])) === 'function'
                || ResponseTypeList.includes(<ResponseTypeValue><unknown>statusHandlers.get(keys[i]))
            )
        ) {
            return statusHandlers.get(keys[i]);
        }
    }
    return null;
}

export const jsonResolve = async (
    response: Response,
    addStatus: boolean,
    processName: string,
    resolve: (value: any) => void,
    internalRequestGuid: string | null = null
): Promise<void> => {
    const { status } = response;
    try {
        const data = await response.json();
        resolve(addStatus ? { status, data } : data);
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting JSON body failed on Status ${status} on ${processName}`,
            data: { internalRequestGuid },
            section: '[chayns-helper]httpRequest.js',
        }, err);
        console.warn(
            ...colorLog.gray(`[HttpRequest<${processName}>]`),
            `Getting JSON body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.None } }, '\n', err
        );
        resolve(null);
    }
};

export const binaryResolve = async (
    response: Response,
    addStatus: boolean,
    processName: string,
    resolve: (value: any) => void,
    internalRequestGuid: string | null = null
): Promise<void> => {
    const { status } = response;
    try {
        const data = await response.arrayBuffer();
        resolve(addStatus ? { status, data } : data);
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting Binary body failed on Status ${status} on ${processName}`,
            data: { internalRequestGuid },
            section: '[chayns-helper]httpRequest.js',
        }, err);
        console.warn(...colorLog.gray(`[HttpRequest<${processName}>]`),
            `Getting Binary body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.None } }, '\n', err
        );
        resolve(null);
    }
};

export const blobResolve = async (
    response: Response,
    addStatus: boolean,
    processName: string,
    resolve: (value: any) => void,
    internalRequestGuid: string | null = null
): Promise<void> => {
    const { status } = response;
    try {
        const data = await response.blob();
        resolve(addStatus ? { status, data } : data);
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting BLOB body failed on Status ${status} on ${processName}`,
            data: { internalRequestGuid },
            section: '[chayns-helper]httpRequest.js',
        }, err);
        console.warn(...colorLog.gray(`[HttpRequest<${processName}>]`),
            `Getting BLOB body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.None } }, '\n', err
        );
        resolve(null);
    }
};

export const textResolve = async (
    response: Response,
    addStatus: boolean,
    processName: string,
    resolve: (value: any) => void,
    internalRequestGuid: string | null = null
): Promise<void> => {
    const { status } = response;
    try {
        const data = await response.text();
        resolve(addStatus ? { status, data } : data);
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting TEXT body failed on Status ${status} on ${processName}`,
            data: { internalRequestGuid },
            section: '[chayns-helper]httpRequest.js',
        }, err);
        console.warn(...colorLog.gray(`[HttpRequest<${processName}>]`),
            `Getting text body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.None } }, '\n', err
        );
        resolve(null);
    }
};

export const objectResolve = async (
    response: Response, processName: string, resolve: (value: any) => void,
    internalRequestGuid: string | null = null
): Promise<void> => {
    const { status } = response;
    try {
        resolve({
            status,
            data: await response.json()
        });
    } catch (err) {
        logger.warning({
            message: `[HttpRequest] Getting JSON body for Object failed on Status ${status} on ${processName}`,
            data: { internalRequestGuid },
            section: '[chayns-helper]httpRequest.js',
        }, err);
        console.warn(...colorLog.gray(`[HttpRequest<${processName}>]`),
            `Getting JSON body for Object failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.Response } }, '\n', err
        );
        resolve({
            status,
            data: null
        });
    }
};

export async function resolveWithHandler(
    handler: ResponseTypeValue | ((response: Response) => any),
    response: Response,
    status: number,
    processName: string,
    resolve: (value?: any) => any,
    reject: (value?: any) => any,
    internalRequestGuid: string,
    chaynsErrorObject: ChaynsErrorObject | null = null,
): Promise<boolean> {
    if (typeof (handler) === 'function') {
        // eslint-disable-next-line no-await-in-loop
        resolve(await handler(<Response><unknown>chaynsErrorObject ?? response));
        return true;
    }
    if (ResponseTypeList.includes(handler)) {
        // TODO: Remove in future release
        if (handler === ResponseType.Object) {
            console.warn(
                ...colorLog.gray(`[HttpRequest<${processName}>]`),
                'ResponseType.Object is deprecated and will be removed in the future. Use ResponseType.Status.Json instead.'
            );
            handler = ResponseType.Status.Json;
        }
        switch (handler) {
            case ResponseType.Json:
            case ResponseType.Status.Json:
                await jsonResolve(
                    response,
                    handler === ResponseType.Status.Json,
                    processName,
                    resolve,
                    internalRequestGuid
                );
                return true;
            case ResponseType.Blob:
            case ResponseType.Status.Blob:
                await blobResolve(
                    response,
                    handler === ResponseType.Status.Blob,
                    processName,
                    resolve,
                    internalRequestGuid
                );
                return true;
            case ResponseType.Text:
            case ResponseType.Status.Text:
                await textResolve(
                    response,
                    handler === ResponseType.Status.Text,
                    processName,
                    resolve,
                    internalRequestGuid
                );
                return true;
            case ResponseType.Binary:
            case ResponseType.Status.Binary:
                await binaryResolve(
                    response,
                    handler === ResponseType.Status.Binary,
                    processName,
                    resolve,
                    internalRequestGuid
                );
                return true;
            case ResponseType.None:
                resolve();
                return true;
            case ResponseType.Status.None:
                resolve({ status, data: undefined })
                return true;
            case ResponseType.ThrowError:
                const error = chaynsErrorObject
                    ? new ChaynsError(chaynsErrorObject, processName, status)
                    : new RequestError(`Status ${status} on ${processName}`, status);
                console.error(...colorLog.gray(`[HttpRequest<${processName}>]`), 'ResponseType \'error\':', error);
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
        },
        section: '[chayns-helper]httpRequest.js',
    });
    return false;
}

// merge 2 options into a map to keep the right object key order
export const mergeOptions = (
    obj1: { [key: string]: any } | Map<string, any>, obj2: { [key: string]: any }): Map<string, any> => {
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
