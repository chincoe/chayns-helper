import handleRequestErrors from './functions/defaultErrorHandler';
import { initLog } from './functions/log';
import { useSelector } from 'react-redux';

/**
 * Constant with a view options that should be setup in the index.js
 * @type {{getRequestErrorHandler: (function()), getSelector: (function()),
 *     textStringPrefix: string, live: boolean}}
 */
export const chaynsHelperConfig = {
    textStringPrefix: '',
    live: false,
    getRequestErrorHandler: () => handleRequestErrors,
    getSelector: () => useSelector
};

/**
 * Initialize the chaynsHelpers, call in index.js
 * @param {string} [textStringPrefix='']
 * @param {boolean} [live=false]
 * @param {function} [requestErrorHandler]
 * @param {function} [selector] - useSelector hook that should be used
 */
export const initChaynsHelper = (
    {
        textStringPrefix = '',
        live = false,
        requestErrorHandler = handleRequestErrors,
        selector = useSelector
    }
) => {
    chaynsHelperConfig.textStringPrefix = textStringPrefix;
    chaynsHelperConfig.live = live;
    chaynsHelperConfig.getRequestErrorHandler = () => requestErrorHandler;
    chaynsHelperConfig.getSelector = () => selector;
    initLog(live);
};
