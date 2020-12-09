export interface ObjectResponse {
    status: number,
    data: object
}

const enum LogLevel {
    info = 'info',
    warning = 'warning',
    error = 'error',
    critical = 'critical',
    none = 'none',
}

export default LogLevel;
