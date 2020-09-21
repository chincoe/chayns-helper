/**
 * @typedef objectResponse
 * @property {number} status,
 * @property {Object} data
 */

/**
 * Log Level
 * @type {{critical: string, warning: string, none: string, error: string, info: string}}
 */
const LogLevel = Object.freeze({
    info: 'info',
    warning: 'warning',
    error: 'error',
    critical: 'critical',
    none: 'none'
});

export default LogLevel;
