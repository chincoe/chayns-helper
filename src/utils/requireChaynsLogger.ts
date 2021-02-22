/**
 * A helper to make the chayns-logger package optional
 */

export type LogObject = {
    message?: string,
    type?: number,
    section?: string,
    customNumber?: number,
    customText?: string,
    data?: {
        [key: string]: any
    },
};

export type ErrorObject = LogObject & {
    ex?: Error
};

export interface ChaynsLogger {
    debug: (logObject: LogObject, applicationUid?: string) => any,
    info: (logObject: LogObject, applicationUid?: string) => any,
    warning: (logObject: ErrorObject, err?: Error, applicationUid?: string) => any,
    error: (logObject: ErrorObject, err?: Error, applicationUid?: string) => any;
    critical: (logObject: ErrorObject, err?: Error, applicationUid?: string) => any;
}

// eslint-disable-next-line import/no-mutable-exports
let chaynsLogger: ChaynsLogger = {
    debug: console.debug,
    info: console.log,
    warning: console.warn,
    error: console.error,
    critical: console.error
}

/**
 * Set a custom logger. Must a debug, info, warning, error and critical function.
 * @param logger
 */
export function setCustomLogger(logger: ChaynsLogger) {
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
    // eslint-disable-next-line global-require
    chaynsLogger = require('chayns-logger/lib/logging');
} catch (e) {
    /* ignored */
}

export default chaynsLogger;
