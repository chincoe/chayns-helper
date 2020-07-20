import handleRequestErrors from './Functions/defaultErrorHandler';
import { initLog } from './Functions/log';

export const chaynsHelperConfig = {
    textStringPrefix: '',
    live: false,
    getRequestErrorHandler: () => handleRequestErrors
};

/**
 * Initialize the chaynsHelpers
 * @param {string} [textStringPrefix='']
 * @param {boolean} [live=false]
 * @param {function} [requestErrorHandler]
 */
export const initChaynsHelper = (
    {
        textStringPrefix = '',
        live = false,
        requestErrorHandler = handleRequestErrors,
    }
) => {
    chaynsHelperConfig.textStringPrefix = textStringPrefix;
    chaynsHelperConfig.live = live;
    chaynsHelperConfig.getRequestErrorHandler = () => requestErrorHandler;
    initLog(live);
};
