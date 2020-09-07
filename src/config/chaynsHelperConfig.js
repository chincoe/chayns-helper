// eslint-disable-next-line import/no-cycle
import chaynsLogger from 'chayns-logger';
import handleRequestErrors, { errorHandlerConfig } from '../functions/defaultErrorHandler';
import { loggerConfig } from './chayns-logger';

import { initLog } from '../functions/log';
import { TEXTSTRING_CONFIG } from '../textstring/TextStringMemo';
import { reduxConfig } from './react-redux';

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
 * @param {function} requestErrorHandler
 * @param {logger} logger - logger, preferably chayns-logger
 * @param {function} useSelector - react-redux useSelector function
 */
const initChaynsHelper = (
    {
        textStringPrefix = '',
        requestErrorHandler = handleRequestErrors,
        logger = chaynsLogger,
        useSelector = () => {
            console.error('[ChaynsHelper] Please call initChaynsHelper({ useSelector }) to use this function');
        }
    }
) => {
    TEXTSTRING_CONFIG.PREFIX = textStringPrefix;
    errorHandlerConfig.getErrorHandler = () => requestErrorHandler;
    loggerConfig.getLogger = () => logger;
    reduxConfig.getSelector = () => useSelector;
    initLog(process.env.NODE_ENV !== 'development');
};

export default initChaynsHelper;
