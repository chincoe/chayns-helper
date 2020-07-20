import { useEffect } from 'react';
import TobitWebSocketClient from 'tobit-websocket-service-client';
import logger from 'chayns-logger';

/**
 * tobit-websocket-client has some unhandled errors. They don't affect the user but generate error logs. Using these
 * with the provided logger middleware reduces the logLevel for those errors to "warning"
 * @type {string[]}
 */
export const wssLoggerIgnore = [
    'null is not an object (evaluating \'a.socket.close\')',
    'Failed to execute \'send\' on \'WebSocket\': Still in CONNECTING state.',
    'a.socket is null',
    'Cannot read property \'close\' of null',
    'Unable to get property \'close\' of undefined or null reference'
];

/**
 * middleware to ignore unnecessary tobit-websocket-client error logs.
 * Add this in your chaynsLogger.init()
 * @param payload
 */
export const wssLoggerIgnoreMiddleware = (payload) => {
    const { message, ex } = payload;
    if ((message && wssLoggerIgnore.some((e) => (e.includes(message))))
        || (ex && ex.message && wssLoggerIgnore.some((e) => (e.includes(ex.message))))) {
        // eslint-disable-next-line no-param-reassign
        payload.level = 'Warning';
    }
};

/**
 * Initialize a websocket client
 * @param {string} serviceName - name of the WS service
 * @param {Object} conditions - conditions for the WS service
 * @param {Object<function>} events - custom events that should be handled.
 *      Format: { [eventName1]: eventListener1, [eventName2]: eventListener2 }
 */
const useWebsocketService = (serviceName, conditions, events) => {
    // events pattern: { [eventName1]: eventListener1, [eventName2]: eventListener2 }
    useEffect(() => {
        const webSocketClient = new TobitWebSocketClient(
            serviceName,
            { ...conditions }
        );

        // WS client default: WS registered successfully
        webSocketClient.on('registered', (data) => {
            // eslint-disable-next-line no-console
            console.notLive.log('[Websocket] client registered', data);
            logger.info({
                message: '[Websocket] client registered',
                data
            });
        });

        // WS client default: WS register error (e.g. WSS webhook didn't work out)
        webSocketClient.on('register_error', (data) => {
            // eslint-disable-next-line no-console
            console.notLive.error('[Websocket] register error', data);
            logger.error({ message: '[Websocket] registration failed' }, data);
        });

        // WS client default: WS connection closed
        webSocketClient.on('CLOSED', (data) => {
            // eslint-disable-next-line no-console
            console.notLive.log('[Websocket] closed', data);
            logger.info({
                message: '[Websocket] connection closed',
                data
            });
        });

        // WS client default: WS connection error
        webSocketClient.on('ERROR', (error) => {
            // eslint-disable-next-line no-console
            console.notLive.error('[Websocket] error', error);
            logger.warning({ message: '[Websocket] error' }, error);
        });

        const eventKeys = Object.keys(events);

        for (let i = 0; i < eventKeys.length; i += 1) {
            if (chayns.utils.isString(eventKeys[i]) && chayns.utils.isFunction(events[i])) {
                webSocketClient.on(eventKeys[i], events[i]);
            }
        }

        return () => {
            webSocketClient.closeConnection();
        };
    }, []);
};

export default useWebsocketService;
