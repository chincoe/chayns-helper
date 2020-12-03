// eslint-disable-next-line import/no-cycle
import TEXTSTRING_PREFIX from '../textstring/textstringPrefix';

export const helperConfig = {
    errorHandler: console.error
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
 * @param {Object} config
 * @param {string} [config.textStringPrefix='']
 * @param {function} [config.requestErrorHandler]
 */
const initChaynsHelper = (config) => {
    const {
        textStringPrefix = '',
        requestErrorHandler = console.error
    } = config || {};
    TEXTSTRING_PREFIX.value = textStringPrefix;
    helperConfig.errorHandler = requestErrorHandler;
};

export default initChaynsHelper;
