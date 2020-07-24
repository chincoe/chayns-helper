import handleRequestErrors from './functions/defaultErrorHandler';
import { initLog } from './functions/log';
import { useSelector } from 'react-redux';

/**
 * default logger
 * @type {{critical(...[*]): void, warning(...[*]): void, error(...[*]): void, info(...[*]): void}}
 */
const defaultLogger = {
    info(...value) {console.notLive.log(...value)},
    warning(...value) {console.notLive.warn(...value)},
    error(...value) {console.notLive.error(...value)},
    critical(...value) {console.notLive.error(...value)}
}

/**
 * Constant with a view options that should be setup in the index.js
 * @type {{getRequestErrorHandler: (function()), getSelector: (function()),
 *     textStringPrefix: string, live: boolean}}
 */
export const chaynsHelperConfig = {
    textStringPrefix: '',
    live: false,
    getRequestErrorHandler: () => handleRequestErrors,
    getLogger: () => defaultLogger,
    getSelector: () => useSelector
};

/**
 * @typedef logger
 * @property {function} info
 * @property {function} warning
 * @property {function} error
 * @property {function} critical
 */
/**
 * Initialize the chaynsHelpers, call in index.js
 * @param {string} [textStringPrefix='']
 * @param {boolean} [live=false]
 * @param {function} [requestErrorHandler]
 * @param {logger} [logger=defaultLogger] - logger, preferably chayns-logger
 * @param {function} [selector] - useSelector hook that should be used
 */
export const initChaynsHelper = (
    {
        textStringPrefix = '',
        live = false,
        requestErrorHandler = handleRequestErrors,
        logger = defaultLogger,
        selector = useSelector
    }
) => {
    chaynsHelperConfig.textStringPrefix = textStringPrefix;
    chaynsHelperConfig.live = live;
    chaynsHelperConfig.getRequestErrorHandler = () => requestErrorHandler;
    chaynsHelperConfig.getSelector = () => selector;
    chaynsHelperConfig.getLogger = () => logger;
    initLog(live);
};
