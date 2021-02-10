import { useEffect, useMemo, useState } from 'react';
// @ts-expect-error
import logger from 'chayns-logger';
import shallowEqual from '../functions/shallowEqual';
import WsClient from '../other/WsClient';
import WebSocketClient, { WebsocketConditions } from '../other/WsClient';
import colorLog from '../utils/colorLog';

const websocketClients: { [serviceName: string]: WebSocketClient } = {};

/**
 * A config for the websocket service
 * @property {string} serviceName
 * @property {WebsocketConditions} conditions
 * @property {Object.<string, function(any, MessageEvent?)>} events
 * @property {string} [clientGroup=undefined]
 * @property {boolean} [waitForDefinedConditions=true]
 * @property {boolean} [forceDisconnectOnUnmount=false]
 * @property {boolean} [forceOwnConnection=false]
 */
export interface WebsocketServiceConfig {
    /**
     * name of your websocket service
     */
    serviceName: string
    /**
     * object with your conditions
     */
    conditions: WebsocketConditions
    /**
     * Format: { [eventName1]: eventListener1, [eventName2]: eventListener2 }
     */
    events: { [topic: string]: (data: { [key: string]: string } | any, wsEvent?: MessageEvent) => void | any }
    /**
     * services of the same client group share a ws connection and their conditions
     */
    clientGroup?: string
    /**
     * only init the service once all conditions are no longer undefined
     * default: true
     */
    waitForDefinedConditions?: boolean
    /**
     *  Disconnect the websocket client if the calling component is unmounted.
     *  Should be deactivated if the same service is used in multiple components
     *  If set to false, it will disconnect once the last component calling this hook has been unmounted.
     *  If set to true, it will disconnect once the first component calling this hook has been unmounted.
     *  default: false
     */
    forceDisconnectOnUnmount?: boolean,
    /**
     * don't use any existing client from rerender hooks. required for wallet items to work properly
     * default: false
     */
    forceOwnConnection?: boolean
}

/**
 * Use a websocket client. Each service is only initialized once.
 * @param config - websocket client configuration
 * @param deps - if these dependencies change, the event listeners will be renewed, default: []
 */
const useWebsocketService = (
    config: WebsocketServiceConfig,
    deps?: any[]
): WebSocketClient | undefined => {
    const {
        serviceName,
        conditions,
        events,
        clientGroup = '',
        waitForDefinedConditions = true,
        forceDisconnectOnUnmount = false,
        forceOwnConnection = chayns.env.site.tapp.id === 250357
    } = config || {};
    // events pattern: { [eventName1]: eventListener1, [eventName2]: eventListener2 }
    const [ownClient, setOwnClient] = useState<WebSocketClient>();
    const ownConnection = useMemo(() => forceOwnConnection, []);
    const group = useMemo(() => clientGroup, []);

    // register default events and update conditions
    useEffect(() => {
        if (waitForDefinedConditions
            && Object.values(conditions)
                .reduce((total, current) => total && current !== undefined, true)
        ) {
            const isInit = ownConnection ? !ownClient : !Object.prototype.hasOwnProperty.call(
                websocketClients,
                `${serviceName}_${group}`
            );

            let webSocketClient: WebSocketClient;

            if (isInit) {
                webSocketClient = new WsClient(
                    serviceName,
                    { ...conditions }
                );
                if (ownConnection) {
                    setOwnClient(webSocketClient);
                } else {
                    websocketClients[`${serviceName}_${group}`] = webSocketClient;
                }
            } else {
                webSocketClient = <WebSocketClient>(ownConnection ? ownClient : websocketClients[`${serviceName}_${group}`]);
            }

            if (!shallowEqual(webSocketClient.conditions, { ...webSocketClient.conditions, ...conditions })) {
                webSocketClient.updateConditions({ ...webSocketClient.conditions, ...conditions });
            }

            webSocketClient.connections++;

            if (isInit) {
                // WS client default: WS registered successfully
                webSocketClient.on('registered', (data) => {
                    if (process.env.NODE_ENV === 'development') {
                        // eslint-disable-next-line no-console
                        console.log(
                            ...colorLog.gray(`[Websocket<${serviceName}>]`),
                            'client registered',
                            { serviceName, conditions, clientGroup }
                        );
                    }
                    logger.info({
                        message: '[Websocket] client registered',
                        data: {
                            data,
                            conditions,
                            serviceName,
                            clientGroup
                        }
                    });
                });

                // WS client default: WS register error (e.g. WSS webhook didn't work out)
                webSocketClient.on('register_error', (data) => {
                    // eslint-disable-next-line no-console
                    console.error(
                        ...colorLog.gray(`[Websocket<${serviceName}>]`), 'register error', data);
                    logger.error({
                        message: '[Websocket] registration failed',
                        data: {
                            conditions,
                            serviceName,
                            clientGroup
                        }
                    }, data);
                });

                // WS client default: WS connection closed
                webSocketClient.on('CLOSED', (data) => {
                    // eslint-disable-next-line no-console
                    if (process.env.NODE_ENV === 'development') {
                        console.log(
                            ...colorLog.gray(`[Websocket<${serviceName}>]`),
                            'connection closed', data
                        );
                    }
                    logger.info({
                        message: '[Websocket] connection closed',
                        data: {
                            data,
                            conditions,
                            serviceName,
                            clientGroup
                        }
                    });
                });

                // WS client default: WS connection error
                webSocketClient.on('ERROR', (error) => {
                    // eslint-disable-next-line no-console
                    console.error(...colorLog.gray(`[Websocket<${serviceName}>]`), 'error', error);
                    logger.warning({
                        message: '[Websocket] error',
                        data: {
                            conditions,
                            serviceName,
                            clientGroup
                        }
                    }, error);
                });
            }
        }
        return () => {
            const webSocketClient = ownConnection ? ownClient : websocketClients[`${serviceName}_${group}`];
            if (webSocketClient) {
                webSocketClient.connections--;
                if (forceDisconnectOnUnmount || ownConnection || !webSocketClient.connections) {
                    webSocketClient.closeConnection();
                    if (!ownConnection) {
                        delete websocketClients[`${serviceName}_${group}`];
                    }
                }
            }
        };
    }, [ownConnection ? null : !!websocketClients[`${serviceName}_${group}`], ...Object.values(conditions)]);

    // register custom events
    useEffect(() => {
        const webSocketClient = ownConnection ? ownClient : websocketClients[`${serviceName}_${group}`];
        if (webSocketClient) {
            const eventKeys = Object.keys(events);

            for (let i = 0; i < eventKeys.length; i += 1) {
                if (typeof (eventKeys[i]) === 'string' && typeof (events[eventKeys[i]]) === 'function') {
                    webSocketClient.on(eventKeys[i], events[eventKeys[i]]);
                }
            }

            return () => {
                for (let i = 0; i < eventKeys.length; i += 1) {
                    if (typeof (eventKeys[i]) === 'string' && typeof (events[eventKeys[i]]) === 'function') {
                        webSocketClient.off(eventKeys[i]);
                    }
                }
            };
        }
        return () => {
        };
    }, [...(deps || []), ownConnection ? ownClient : websocketClients[`${serviceName}_${group}`]]);

    return ownConnection ? ownClient : websocketClients[`${serviceName}_${group}`];
};

export default useWebsocketService;
