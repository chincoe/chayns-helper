import colorLog from '../utils/colorLog';
import logger from '../utils/requireChaynsLogger';
import jsonLog from '../utils/jsonLog';

export type WebsocketConditions =
    Record<string, string | number | boolean>
    & Partial<{ tobitAccessToken: string, tappId: number, boardId: number }>;

/**
 * This websocket client works exactly like the tobit-websocket-service-client but has additional null value handling
 * and additional precautions to prevent duplicate connections
 */
class WebSocketClient {
    private readonly reconnectTimeoutTime: number;

    private readonly checkConnectionIntervalTime: number;

    private readonly application: string | null = null;

    public conditions: WebsocketConditions | null = null;

    public socket: WebSocket | null = null;

    private checkConnectionInterval: number | null = null;

    private reconnectTimeout: number | null = null;

    private answeredPing = false;

    private readonly listener: { [event: string]: (...args: any[]) => any } = {};

    private shouldReconnect = true;

    public connections: number = 0;

    public clientGroup: string;

    constructor(
        application: string,
        conditions: WebsocketConditions,
        options: {
            reconnectTimeout?: number,
            checkConnectionInterval?: number,
            clientGroup?: string
        } = {}
    ) {
        this.application = application;
        this.conditions = conditions;
        this.clientGroup = options.clientGroup || "";

        // set default listeners for the default events
        this.listener = {
            registered(data) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        ...colorLog.gray(`[Websocket<${application}>]`),
                        'client registered',
                        { serviceName: application, conditions, clientGroup: options.clientGroup }
                    );
                }
                logger.info(jsonLog({
                    message: '[Websocket] client registered',
                    data: {
                        data,
                        conditions,
                        serviceName: application,
                        clientGroup: options.clientGroup
                    },
                    section: '[chayns-helper]WebSocketClient.js'
                }));
            },
            register_error: (data) => {
                console.error(...colorLog.gray(`[Websocket<${application}>]`), 'register error', data);
                logger.error(jsonLog({
                    message: '[Websocket] registration failed',
                    data: {
                        conditions,
                        serviceName: application,
                        clientGroup: options.clientGroup
                    },
                    section: '[chayns-helper]WebSocketClient.js'
                }), data as Error);
            },
            CLOSED: (data) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        ...colorLog.gray(`[Websocket<${application}>]`),
                        'connection closed', data
                    );
                }
                logger.info(jsonLog({
                    message: '[Websocket] connection closed',
                    data: {
                        data,
                        conditions,
                        serviceName: application,
                        clientGroup: options.clientGroup
                    },
                    section: '[chayns-helper]WebSocketClient.js'
                }));
            },
            ERROR: (error) => {
                console.warn(...colorLog.gray(`[Websocket<${application}>]`), 'error', error);
                logger.warning(jsonLog({
                    message: '[Websocket] error',
                    data: {
                        conditions,
                        serviceName: application,
                        clientGroup: options.clientGroup
                    },
                    section: '[chayns-helper]WebSocketClient.js'
                }), error as Error);
            },
            ...this.listener
        }

        this.reconnectTimeoutTime = options.reconnectTimeout || 5000;
        this.checkConnectionIntervalTime = options.checkConnectionInterval || 2000;

        this.createConnection();
    }

    /**
     * @private
     */
    private onOpen = () => {
        clearTimeout(<number>this.reconnectTimeout);

        this.send('register', {
            application: this.application,
            conditions: this.conditions,
        });

        this.answeredPing = true;
        clearInterval(<number>this.checkConnectionInterval);
        this.checkConnectionInterval = <number><unknown>setInterval(
            this.checkConnection, this.checkConnectionIntervalTime);

        this.emit('OPEN');
    };

    /**
     * @private
     */
    private onMessage = (e: MessageEvent) => {
        const message = JSON.parse(e.data);

        if (message.topic === 'pong') {
            this.answeredPing = true;
            return;
        }

        this.emit(message.topic, message.data, e);
    };

    /**
     * @private
     */
    private onError = (err?: Event) => {
        this.emit('ERROR', err, err);
    };

    /**
     * @private
     */
    private onClose = (event?: CloseEvent) => {
        clearInterval(<number>this.checkConnectionInterval);
        if (this.socket) {
            this.socket.onopen = () => {
            };
            this.socket.onerror = () => {
            };
            this.socket.onclose = () => {
            };
            this.socket.onmessage = () => {
            };
        }
        this.socket = null;
        clearTimeout(<number>this.reconnectTimeout);
        if (this.shouldReconnect) {
            this.reconnectTimeout = <number><unknown>setTimeout(
                this.createConnection, this.reconnectTimeoutTime);
        }

        this.emit('CLOSED', event, event);
    };

    /**
     * @private
     */
    private checkConnection = () => {
        if (!this.answeredPing) {
            if (this.socket && this.socket?.close) {
                this.socket?.close();
            } else {
                this.onClose();
            }
            return;
        }

        this.send('ping');
        this.answeredPing = false;
    };

    private send = (topic: string, data?: any) => {
        if (this.socket
            && this.socket?.readyState === WebSocket.OPEN
            && this.socket?.readyState !== WebSocket.CONNECTING) {
            this.socket?.send(JSON.stringify({
                topic,
                data
            }));
        }
    };

    private createConnection = () => {
        if (this.socket) {
            this.socket.onopen = () => {
            };
            this.socket.onerror = () => {
            };
            this.socket.onclose = () => {
            };
            this.socket.onmessage = () => {
            };
            this.socket.close();
        }
        this.socket = new WebSocket('wss://websocket.tobit.com');

        this.socket.onopen = this.onOpen;
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
    };

    private emit = (event: string, data?: any, wsEvent: Event | null = null) => {
        if (typeof this.listener[event] === 'function') {
            this.listener[event](data, wsEvent);
        }
    };

    /**
     * Registers a new event handler for the given event name.
     * Overrides any previous event handler for this event.
     */
    public on = (
        event: string,
        listener: (data: Record<string, number | string | null> | Error, wsEvent: MessageEvent) => any
    ) => {
        this.listener[event] = listener;
    };

    public off = (event: string) => {
        this.listener[event] = () => {
        };
    };

    /**
     * Registers a new event handler that is called once for the given event name.
     */
    public once = (
        event: string,
        listener: (data: { [key: string]: number | string | null }, wsEvent: MessageEvent) => any
    ) => {
        this.listener[event] = (data, wsEvent) => {
            listener(data, wsEvent);
            this.listener[event] = () => {
            };
        };
    };

    /**
     * Updates the conditions.
     * @param {Object} conditions
     */
    public updateConditions = (conditions: WebsocketConditions) => {
        this.conditions = conditions;
        this.send('register', {
            application: this.application,
            conditions: this.conditions,
        });
    };

    /**
     * Close websocket connection.
     */
    public closeConnection = () => {
        this.shouldReconnect = false;
        if (this?.socket && this?.socket?.close) {
            this?.socket?.close();
        } else {
            this.onClose();
        }
    };
}

export default WebSocketClient;
