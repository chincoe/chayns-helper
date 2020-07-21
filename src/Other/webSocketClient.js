import logger from 'chayns-logger';

const isStringAndNotWhitespace = (str) => typeof str === 'string' && str.trim() !== '';

/**
 * Custom websocket client class.
 * Similar usage as tobit-websocket-client but customizable to fix some unhandled errors
 */
class WebSocketClient {
    connectionStatus = 'online';

    reconnectTimeout = null;

    isReconnecting = false;

    autoReconnect = false;

    connectionFails = 0;

    isConnected = false;

    conditions = null;

    listeners = [];

    application = null;

    isOnline = false;

    sendQueue = [];

    socket = null;

    url = null;

    connectionHealthy = true;

    checkConnectionInterval = null;

    constructor(
        {
            application,
            conditions,
            url = 'wss://websocket.tobit.com',
            autoReconnect = false
        }
    ) {
        if (isStringAndNotWhitespace(url)) {
            this.autoReconnect = autoReconnect;
            this.application = application;
            this.url = url;
            this.conditions = conditions;

            this.initialize();
        }
    }

    initialize = () => {
        this.socket = new WebSocket(this.url);
        this.isReconnecting = false;

        this.socket.onopen = () => {
            clearTimeout(this.reconnectTimeout);

            this.connectionHealthy = true;
            this.connectionFails = 0;
            this.isConnected = true;

            if (isStringAndNotWhitespace(this.application)) {
                this.send('register', {
                    application: this.application,
                    conditions: this.conditions
                });
            }

            this.checkConnectionInterval = setInterval(
                this.checkConnection,
                60000
            );
        };

        this.socket.onerror = () => {
            this.connectionFails += 1;

            logger.warning({
                message: 'Error occured in websocket client',
                section: 'WebSocketClient_initialize_onerror',
                data: {
                    connectionStatus: this.connectionStatus,
                    connectionFails: this.connectionFails
                }
            });

            if (this.socket) {
                this.socket.close();
            }
        };

        this.socket.onclose = this.handleCloseWebSocket;

        this.socket.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            if (eventData.topic === 'registered' && !this.isOnline) {
                this.isOnline = true;

                this.handleMessageToListener('ONLINE');

                this.sendQueue.forEach((item) => this.send(item.topic, item.data));
                this.sendQueue = [];
            } else if (eventData.topic === 'pong') {
                this.connectionHealthy = true;
            } else {
                const messageData = eventData.data;
                this.handleMessageToListener(eventData.topic, messageData);
            }
        };
    };

    handleReconnect = () => {
        if (
            !this.autoReconnect
            || this.isReconnecting
            || this.isConnected
            || this.connectionStatus === 'offline'
        ) return;
        this.isReconnecting = true;

        clearTimeout(this.reconnectTimeout);

        let nextReconnectTime = 2500;

        if (this.connectionFails > 3) nextReconnectTime = 15000;
        if (this.connectionFails > 10) nextReconnectTime = 120000;

        this.reconnectTimeout = setTimeout(this.initialize, nextReconnectTime);
    };

    handleCloseWebSocket = () => {
        this.isConnected = false;
        this.isOnline = false;

        this.handleMessageToListener('OFFLINE');

        try {
            if (this.socket) {
                this.socket.close();
            }
        } finally {
            this.socket = null;

            this.handleReconnect();
        }
    };

    handleMessageToListener = (topic, data = null) => {
        const topicListeners = this.listeners.filter((e) => e.topic === topic);
        topicListeners.forEach((listener) => listener.callback(data));
    };

    addListener = (topic, callback) => {
        this.listeners.push({ topic, callback });
    };

    removeListener = (topic, callback) => {
        this.listeners = this.listeners.filter(
            (e) => e.topic !== topic && e.callback !== callback
        );
    };

    send = (topic, data) => {
        if (this.isConnected) {
            this.socket.send(JSON.stringify({ topic, data }));
        } else {
            this.sendQueue.push({ topic, data });
        }
    };

    setConnectionStatus = (status) => {
        this.connectionStatus = status;

        if (status === 'offline') {
            this.handleCloseWebSocket();
        } else if (status === 'online' && !this.isConnected) {
            this.handleReconnect();
        }
    };

    checkConnection = () => {
        if (this.connectionHealthy === false && !this.isReconnecting) {
            clearInterval(this.checkConnectionInterval);
            this.handleCloseWebSocket();
            return;
        }

        this.send('ping', {});
        this.connectionHealthy = false;
    };
}

export default WebSocketClient;
