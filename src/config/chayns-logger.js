const defaultLogger = {
    // eslint-disable-next-line no-console
    info(...value) { console.log(...value); },
    // eslint-disable-next-line no-console
    warning(...value) { console.warn(...value); },
    error(...value) { console.error(...value); },
    critical(...value) { console.error(...value); }
};

export const loggerConfig = {
    getLogger: () => defaultLogger
};

export default loggerConfig.getLogger();
