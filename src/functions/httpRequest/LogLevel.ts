export interface ObjectResponse {
    status: number,
    data: object
}

/**
 * An enum for request.fetch logLevels
 */
const LogLevel: {
    info: 'info',
    warning: 'warning',
    error: 'error',
    critical: 'critical',
    none: 'none',
} = {
    info: 'info',
    warning: 'warning',
    error: 'error',
    critical: 'critical',
    none: 'none',
}

export type LogLevelType = typeof LogLevel[keyof typeof LogLevel]

export default LogLevel;
