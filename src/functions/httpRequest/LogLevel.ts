export interface ObjectResponse {
    status: number,
    data: object
}

export enum LogLevel {
    info = 'info',
    warning = 'warning',
    error = 'error',
    critical = 'critical',
    none = 'none',
}

export default LogLevel;
