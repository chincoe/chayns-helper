export interface ObjectResponse {
    status: number,
    data: object
}

export enum LogLevelEnum {
    info = 'info',
    warning = 'warning',
    error = 'error',
    critical = 'critical',
    none = 'none',
}

/**
 * An enum for request.fetch logLevels
 */
const LogLevel = {
    info: 'info',
    warning: 'warning',
    error: 'error',
    critical: 'critical',
    none: 'none',
}

export default LogLevel;
