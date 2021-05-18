import logger from '../../utils/requireChaynsLogger';
import colorLog from '../../utils/colorLog';
import { regexRegex, stringToRegexStrict } from '../../utils/stringToRegex';
import ChaynsError, { ChaynsErrorObject } from './ChaynsError';
import getChaynsErrorCode from './getChaynsErrorCode';
import { chaynsErrorCodeRegex } from './isChaynsError';
import LogLevel from './LogLevel';
import RequestError from './RequestError';
import { ResponseType, ResponseTypeList } from './ResponseType';

export const getMapKeys = (map: Map<string, unknown>): string[] => {
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
    logConfig: Map<string, LogLevel>,
    defaultFunction: (data: Record<string, unknown>) => unknown,
    chaynsErrorObject?: ChaynsErrorObject
): Promise<(data: Record<string, unknown>, error?: Error) => unknown> {
    const logKeys: string[] = [];
    const mapKeys = getMapKeys(logConfig);
    logKeys.push(...(mapKeys.filter((k) => !/^[0-9]+$/.test(k)
        && !regexRegex.test(k)
        && chaynsErrorCodeRegex.test(k))));
    logKeys.push(...(mapKeys.filter((k) => !logKeys.includes(k))));

    console.debug(...colorLog.gray('[HttpRequest]'), 'Getting log level by status', {
        status,
        defaultFunction,
        chaynsErrorObject,
        logConfig,
        logKeys
    });

    let chaynsErrorCode: string | null = null;
    if (chaynsErrorObject) {
        chaynsErrorCode = await getChaynsErrorCode(chaynsErrorObject);
    }

    const levelKey = logKeys
        .find((key) => (
            (/^[0-9]+$/.test(key) && parseInt(key, 10) === status)
            || stringToRegexStrict(key).test(`${status}`)
            || (chaynsErrorCode && key === chaynsErrorCode)
            || (chaynsErrorCode && stringToRegexStrict(key).test(chaynsErrorCode))
        ));
    console.debug(...colorLog.gray('[HttpRequest]'), 'Found log key for status', {
        status,
        chaynsErrorCode,
        levelKey,
        level: logConfig.get(levelKey || '')
    });
    if (levelKey && logConfig.get(levelKey)) {
        switch (logConfig.get(levelKey)) {
            case LogLevel.info:
                return (logger.info as (data: Record<string, unknown>, error?: Error) => void);
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
    statusHandlers: Map<string, ((response: Response) => unknown) | ResponseType>
): ((response: Response) => unknown) | ResponseType | null | undefined {
    const keys = getMapKeys(statusHandlers);
    for (let i = 0; i < keys.length; i += 1) {
        const regExp = stringToRegexStrict(keys[i]);
        if (regExp.test(status?.toString())
            && (typeof (statusHandlers.get(keys[i])) === 'function'
                || ResponseTypeList.includes(<ResponseType><unknown>statusHandlers.get(keys[i]))
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
    resolve: (value: unknown) => void,
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
        // eslint-disable-next-line no-console
        console.warn(
            ...colorLog.gray(`[HttpRequest<${processName}>]`),
            // eslint-disable-next-line max-len
            `Getting JSON body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.None } }, '\n', err
        );
        resolve(addStatus ? { status, data: null } : null);
    }
};

export const binaryResolve = async (
    response: Response,
    addStatus: boolean,
    processName: string,
    resolve: (value: unknown) => void,
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
        // eslint-disable-next-line no-console
        console.warn(
            ...colorLog.gray(`[HttpRequest<${processName}>]`),
            // eslint-disable-next-line max-len
            `Getting Binary body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.None } }, '\n', err
        );
        resolve(addStatus ? { status, data: null } : null);
    }
};

export const blobResolve = async (
    response: Response,
    addStatus: boolean,
    processName: string,
    resolve: (value: unknown) => void,
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
        // eslint-disable-next-line no-console
        console.warn(
            ...colorLog.gray(`[HttpRequest<${processName}>]`),
            // eslint-disable-next-line max-len
            `Getting BLOB body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.None } }, '\n', err
        );
        resolve(addStatus ? { status, data: null } : null);
    }
};

export const textResolve = async (
    response: Response,
    addStatus: boolean,
    processName: string,
    resolve: (value: unknown) => void,
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
        // eslint-disable-next-line no-console
        console.warn(
            ...colorLog.gray(`[HttpRequest<${processName}>]`),
            // eslint-disable-next-line max-len
            `Getting text body failed on Status ${status} on ${processName}. If this is expected behavior, consider adding a statusHandler in your request options for this case:`,
            { statusHandlers: { [status]: ResponseType.None } }, '\n', err
        );
        resolve(addStatus ? { status, data: null } : null);
    }
};

export async function resolveWithHandler(
    handler: ResponseType | ((response: Response) => unknown),
    response: Response,
    status: number,
    processName: string,
    resolve: (value?: unknown) => void,
    reject: (value?: unknown) => void,
    internalRequestGuid: string,
    chaynsErrorObject: ChaynsErrorObject | null = null,
): Promise<boolean> {
    console.debug(...colorLog.gray(`[HttpRequest<${processName}>]`), 'Resolving with handler', {
        handler,
        response,
        status,
        chaynsErrorObject
    });
    if (typeof (handler) === 'function') {
        // eslint-disable-next-line no-await-in-loop
        resolve(await handler(<Response><unknown>chaynsErrorObject ?? response));
        return true;
    }
    if (ResponseTypeList.includes(handler)) {
        // TODO: Remove in future release
        if (handler === ResponseType.Object) {
            // eslint-disable-next-line no-console
            console.warn(
                ...colorLog.gray(`[HttpRequest<${processName}>]`),
                // eslint-disable-next-line max-len
                'ResponseType.Object is deprecated and will be removed in the future. Use ResponseType.JsonWithStatus instead.'
            );
            // eslint-disable-next-line no-param-reassign
            handler = ResponseType.JsonWithStatus;
        }
        switch (handler) {
            case ResponseType.Json:
            case ResponseType.JsonWithStatus:
                await jsonResolve(
                    response,
                    handler === ResponseType.JsonWithStatus,
                    processName,
                    resolve,
                    internalRequestGuid
                );
                return true;
            case ResponseType.Blob:
            case ResponseType.BlobWithStatus:
                await blobResolve(
                    response,
                    handler === ResponseType.BlobWithStatus,
                    processName,
                    resolve,
                    internalRequestGuid
                );
                return true;
            case ResponseType.Text:
            case ResponseType.TextWithStatus:
                await textResolve(
                    response,
                    handler === ResponseType.TextWithStatus,
                    processName,
                    resolve,
                    internalRequestGuid
                );
                return true;
            case ResponseType.Binary:
            case ResponseType.BinaryWithStatus:
                await binaryResolve(
                    response,
                    handler === ResponseType.BinaryWithStatus,
                    processName,
                    resolve,
                    internalRequestGuid
                );
                return true;
            case ResponseType.None:
                resolve();
                return true;
            case ResponseType.NoneWithStatus:
                resolve({ status, data: undefined });
                return true;
            case ResponseType.ThrowError:
                const error = chaynsErrorObject
                    ? new ChaynsError(chaynsErrorObject, processName, status)
                    : new RequestError(`Status ${status} on ${processName}`, status);
                // eslint-disable-next-line no-console
                console.warn(...colorLog.gray(`[HttpRequest<${processName}>]`), 'ResponseType \'error\':', error);
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
export const mergeOptions = <T>(
    obj1: Record<string, T> | Map<string, T>,
    obj2: Record<string, T> | Map<string, T>
): Map<string, T> => {
    const result: Map<string, T> = obj1 instanceof Map ? obj1 : new Map();
    if (!(obj1 instanceof Map)) {
        const keys1 = Object.keys(obj1);
        for (let i = 0; i < keys1.length; i++) {
            result.set(keys1[i], obj1[keys1[i]]);
        }
    }
    const keys2 = obj2 instanceof Map ? getMapKeys(obj2 as Map<string, T>) : Object.keys(obj2);
    for (let i = 0; i < keys2.length; i++) {
        if (!result.get(keys2[i])) {
            result.set(keys2[i], obj2 instanceof Map ? obj2.get(keys2[i]) as T : obj2[keys2[i]] as T);
        }
    }
    return result;
};
