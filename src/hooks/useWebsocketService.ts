import { useEffect, useMemo, useState } from 'react';
import { deepEqual } from '../functions/shallowEqual';
import WebSocketClient, { WebsocketConditions } from '../other/WebSocketClient';
import { WebsocketClient } from '../index';

const websocketClients: { [serviceName: string]: WebSocketClient } = {};

/**
 * A config for the websocket service
 * @property serviceName - name of your websocket service
 * @property conditions - object with your conditions
 * @property events - WS Event Listeners. Format: { [eventName1]: eventListener1, [eventName2]: eventListener2 }
 * @property [clientGroup=undefined] - services of the same client group share a ws connection and their conditions
 * @property [waitForDefinedConditions=true] - only init the service once all conditions are no longer undefined;
 *     default: true
 * @property [forceDisconnectOnUnmount=false] - Disconnect the websocket client if the calling component is unmounted.
 *     Should be deactivated if the same service is used in multiple components. If set to false, it will disconnect
 *     once the last component calling this hook has been unmounted. If set to true, it will disconnect once the first
 *     component calling this hook has been unmounted. default: false
 * @property [forceOwnConnection=false] - don't use any existing client from other hooks. required for wallet items
 *     to work properly. default: false
 */
export interface WebsocketServiceConfig {
    serviceName: string;
    conditions: WebsocketConditions;
    events: Record<string, (data: Record<string, unknown> | unknown, wsEvent?: MessageEvent | Event | null) => void>;
    clientGroup?: string;
    waitForDefinedConditions?: boolean;
    forceDisconnectOnUnmount?: boolean;
    forceOwnConnection?: boolean;
}

/**
 * Use a websocket client. Each service is only initialized once.
 * @param config - websocket client configuration
 * @param deps - if these dependencies change, the event listeners will be renewed, default: []
 */
const useWebsocketService = (
    config: WebsocketServiceConfig,
    deps?: unknown[]
): WebSocketClient | undefined => {
    const {
        serviceName,
        conditions,
        events,
        clientGroup = '',
        waitForDefinedConditions = true,
        forceDisconnectOnUnmount = false
    } = config || {};
    const forceOwnConnection = config?.forceOwnConnection ?? chayns.env.site.tapp.id === 250357;
    // events pattern: { [eventName1]: eventListener1, [eventName2]: eventListener2 }
    const [ownClient, setOwnClient] = useState<WebSocketClient>();
    const ownConnection = useMemo(() => forceOwnConnection, []);
    const group = useMemo(() => clientGroup, []);

    // register default events and update conditions
    useEffect(() => {
        if (waitForDefinedConditions
            && Object.values(conditions).reduce((total, current) => total && current !== undefined, true)
        ) {
            const isInit = ownConnection ? !ownClient : !Object.prototype.hasOwnProperty.call(
                websocketClients,
                `${serviceName}_${group}`
            );

            let webSocketClient: WebSocketClient;

            if (isInit) {
                webSocketClient = new WebSocketClient(
                    serviceName,
                    { ...conditions },
                    {
                        clientGroup
                    }
                );
                if (ownConnection) {
                    setOwnClient(webSocketClient);
                } else {
                    websocketClients[`${serviceName}_${group}`] = webSocketClient;
                }
            } else {
                webSocketClient = (ownConnection
                        ? ownClient
                        : websocketClients[`${serviceName}_${group}`]
                ) as WebsocketClient;
            }

            if (!deepEqual(webSocketClient.conditions, { ...webSocketClient.conditions, ...conditions })) {
                webSocketClient.updateConditions({ ...webSocketClient.conditions, ...conditions });
            }

            webSocketClient.connections++;
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
        return () => null;
    }, [...(deps || []), ownConnection ? ownClient : websocketClients[`${serviceName}_${group}`]]);

    return ownConnection ? ownClient : websocketClients[`${serviceName}_${group}`];
};

export default useWebsocketService;
