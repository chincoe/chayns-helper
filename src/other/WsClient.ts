export type WebsocketConditions = { [key: string]: string | number | boolean };

/**
 * This websocket client works exactly like the tobit-websocket-service-client but had additional null value handling
 */
class WebSocketClient {
    reconnectTimeoutTime: number;

    checkConnectionIntervalTime: number;

    application: string | null = null;

    conditions: WebsocketConditions | null = null;

    /**
     * @type {WebSocket|null}
     */
    socket: WebSocket | null = null;

    checkConnectionInterval: NodeJS.Timeout | null = null;

    reconnectTimeout: NodeJS.Timeout | null = null;

    answeredPing = false;

    listener: { [event: string]: (...args: any[]) => any } = {};

    shouldReconnect = true;

    constructor(
        application: string,
        conditions: WebsocketConditions,
        options: {
            reconnectTimeout?: number,
            checkConnectionInterval?: number
        } = {}
    ) {
        this.application = application;
        this.conditions = conditions;

        this.reconnectTimeoutTime = options.reconnectTimeout || 5000;
        this.checkConnectionIntervalTime = options.checkConnectionInterval || 2000;

        this.createConnection();
    }

    /**
     * @private
     */
    onOpen = () => {
        clearTimeout(<NodeJS.Timeout>this.reconnectTimeout);

        this.send('register', {
            application: this.application,
            conditions: this.conditions,
        });

        this.answeredPing = true;
        clearInterval(<NodeJS.Timeout>this.checkConnectionInterval);
        this.checkConnectionInterval = setInterval(this.checkConnection, this.checkConnectionIntervalTime);

        this.emit('OPEN');
    };

    /**
     * @private
     */
    onMessage = (e: MessageEvent) => {
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
    onError = (err?: Event) => {
        this.emit('ERROR', err, err);
    };

    /**
     * @private
     */
    onClose = (event?: CloseEvent) => {
        clearInterval(<NodeJS.Timeout>this.checkConnectionInterval);
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
        clearTimeout(<NodeJS.Timeout>this.reconnectTimeout);
        if (this.shouldReconnect) this.reconnectTimeout = setTimeout(this.createConnection, this.reconnectTimeoutTime);

        this.emit('CLOSED', event, event);
    };

    /**
     * @private
     */
    checkConnection = () => {
        if (this.answeredPing === false) {
            if (this?.socket && this?.socket?.close) {
                this?.socket?.close();
            } else {
                this.onClose();
            }
            return;
        }

        // @ts-expect-error
        this.send('ping');
        this.answeredPing = false;
    };

    /**
     * @private
     */
    send = (topic: string, data: any) => {
        if (this.socket
            && this.socket?.readyState === WebSocket.OPEN
            && this.socket?.readyState !== WebSocket.CONNECTING) {
            this.socket?.send(JSON.stringify({
                topic,
                data
            }));
        }
    };

    /**
     * @private
     */
    createConnection = () => {
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

    /**
     * @private
     */
    emit = (event: string, data?: any, wsEvent: Event | null = null) => {
        if (typeof this.listener[event] === 'function') {
            this.listener[event](data, wsEvent);
        }
    };

    /**
     * Registers a new event handler for the given event name.
     * Overrides any previous event handler for this event.
     */
    on = (event: string, listener: (data: { [key: string]: number | string | null }, wsEvent: MessageEvent) => any) => {
        this.listener[event] = listener;
    };

    off = (event: string) => {
        this.listener[event] = () => {
        };
    };

    /**
     * Registers a new event handler that is called once for the given event name.
     */
    once = (event: string, listener: (data: { [key: string]: number | string | null }, wsEvent: MessageEvent) => any) => {
        this.listener[event] = (data, wsEvent) => {
            listener(data, wsEvent);
            this.listener[event] = () => {
            };
        };
    };

    /**
     * Updates the conditions.
     * @param {Object} conditions
     * @public
     */
    updateConditions = (conditions: WebsocketConditions) => {
        this.conditions = conditions;
        this.send('register', {
            application: this.application,
            conditions: this.conditions,
        });
    };

    /**
     * Close websocket connection.
     * @public
     */
    closeConnection = () => {
        this.shouldReconnect = false;
        if (this?.socket && this?.socket?.close) {
            this?.socket?.close();
        } else {
            this.onClose();
        }
    };
}

export default WebSocketClient;
