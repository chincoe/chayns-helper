import handleRequestErrors from './functions/defaultErrorHandler';
import { initLog } from './functions/log';
import WsClient from './other/WsClient';

/**
 * default logger
 * @type {{critical(...[*]): void, warning(...[*]): void, error(...[*]): void, info(...[*]): void}}
 */
const defaultLogger = {
    info(...value) {console.notLive.log(...value);},
    warning(...value) {console.notLive.warn(...value);},
    error(...value) {console.notLive.error(...value);},
    critical(...value) {console.notLive.error(...value);}
};

/**
 * @class
 * @param serviceName
 * @param conditions
 * @returns {DefaultWebsocketClient}
 * @constructor
 */
function DefaultWebsocketClient(serviceName, conditions) {
    console.warn('[WebsocketClient] Please specify a websocket client in your initChaynsHelper to use this feature');
    this.handlers = {};
    this.serviceName = serviceName;
    this.conditions = conditions;
    this.updateConditions = function () {};
    this.on = function (wsEvent, listener) {
        this.handlers[wsEvent] = listener;
    };
    this.closeConnection = function () {};
    return this;
}

/**
 * config
 * @type {{getRequestErrorHandler: (function(): handleRequestErrors), getLogger: (function(): {critical, (...[*]):
 *     void, warning, (...[*]): void, error, (...[*]): void, info, (...[*]): void}), textStringPrefix: string, live:
 *     boolean, getWebsocketClient: (function(): DefaultWebsocketClient)}}
 */
export const chaynsHelperConfig = {
    textStringPrefix: '',
    live: false,
    getRequestErrorHandler: () => handleRequestErrors,
    getLogger: () => defaultLogger,
    getWebsocketClient: () => WsClient
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
 * @param {function|Class} websocketClient
 */
export const initChaynsHelper = (
    {
        textStringPrefix = '',
        live = false,
        requestErrorHandler = handleRequestErrors,
        logger = defaultLogger,
        websocketClient = DefaultWebsocketClient
    }
) => {
    chaynsHelperConfig.textStringPrefix = textStringPrefix;
    chaynsHelperConfig.live = live;
    chaynsHelperConfig.getRequestErrorHandler = () => requestErrorHandler;
    chaynsHelperConfig.getLogger = () => logger;
    chaynsHelperConfig.getWebsocketClient = () => websocketClient;
    initLog(live);
};
