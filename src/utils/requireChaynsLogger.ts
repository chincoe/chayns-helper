/**
 * A helper to make the chayns-logger package optional
 */

export type LogObject = {
    message?: string,
    type?: number,
    section?: string,
    customNumber?: number,
    customText?: string,
    data?: Record<string, unknown>,
};

export type ErrorObject = LogObject & {
    ex?: Error
};

export interface ChaynsLogger {
    debug: (logObject: LogObject, applicationUid?: string) => void,
    info: (logObject: LogObject, applicationUid?: string) => void,
    warning: (logObject: ErrorObject, err?: Error, applicationUid?: string) => void,
    error: (logObject: ErrorObject, err?: Error, applicationUid?: string) => void;
    critical: (logObject: ErrorObject, err?: Error, applicationUid?: string) => void;
}

// eslint-disable-next-line import/no-mutable-exports
let chaynsLogger: ChaynsLogger = {
    debug: console.debug,
    // eslint-disable-next-line no-console
    info: console.log,
    // eslint-disable-next-line no-console
    warning: console.warn,
    error: console.error,
    critical: console.error
};

/**
 * Set a custom logger. Must a debug, info, warning, error and critical function.
 * @param logger
 */
export function setCustomLogger(logger: ChaynsLogger): void {
    const customLogger = {
        ...chaynsLogger,
        ...logger
    };
    chaynsLogger.debug = customLogger.debug;
    chaynsLogger.info = customLogger.info;
    chaynsLogger.warning = customLogger.warning;
    chaynsLogger.error = customLogger.error;
    chaynsLogger.critical = customLogger.critical;
}

try {
    chaynsLogger = {
        // eslint-disable-next-line global-require
        ...require('chayns-logger/lib/logging')
    };
} catch (e) {
    /* ignored */
}

export default chaynsLogger;
