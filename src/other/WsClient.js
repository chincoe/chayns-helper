/**
 * This websocket client works exactly like the tobit-websocket-service-client but had additional null value handling
 * @class
 * @type {{closeConnection: function(), createConnection: function(), updateConditions: function(Object), on:
 *     function(string, wsEventHandler), once: function(string, wsEventHandler), off: function(string)}}
 *     WebSocketClient
 */
class WebSocketClient {
    reconnectTimeoutTime;

    checkConnectionIntervalTime;

    application = null;

    conditions = null;

    /**
     * @type {WebSocket|null}
     */
    socket = null;

    checkConnectionInterval = null;

    reconnectTimeout = null;

    answeredPing = false;

    listener = {};

    /**
     * @param {string} application - name of the application
     * @param {Object} [conditions] - conditions for registration
     * @param {Object} [options]
     * @param {number} [options.reconnectTimeout=5000] - time in milliseconds after trying to reconnect on connection
     *     termination
     * @param {number} [options.checkConnectionInterval=2000] - time in milliseconds for connection check interval
     */
    constructor(application, conditions, options = {}) {
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
        clearTimeout(this.reconnectTimeout);

        this.send('register', {
            application: this.application,
            conditions: this.conditions,
        });

        this.answeredPing = true;
        clearInterval(this.checkConnectionInterval);
        this.checkConnectionInterval = setInterval(this.checkConnection, this.checkConnectionIntervalTime);

        this.emit('OPEN');
    };

    /**
     * @private
     */
    onMessage = (e) => {
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
    onError = (err) => {
        this.emit('ERROR', err, err);
    };

    /**
     * @private
     */
    onClose = (event) => {
        clearInterval(this.checkConnectionInterval);
        if (this.socket) {
            this.socket.onopen = () => {};
            this.socket.onerror = () => {};
            this.socket.onclose = () => {};
            this.socket.onmessage = () => {};
        }
        this.socket = null;
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(this.createConnection, this.reconnectTimeoutTime);

        this.emit('CLOSED', event, event);
    };

    /**
     * @private
     */
    checkConnection = () => {
        if (this.answeredPing === false) {
            if (this?.socket && this?.socket?.close) this?.socket?.close();
            this.onClose();
            return;
        }

        this.send('ping');
        this.answeredPing = false;
    };

    /**
     * @private
     */
    send = (topic, data) => {
        if (this.socket
            && this.socket?.readyState === WebSocket.OPEN
            && this.socket?.readyState !== WebSocket.CONNECTING) {
            this.socket?.send(JSON.stringify({ topic, data }));
        }
    };

    /**
     * @private
     */
    createConnection = () => {
        this.socket = new WebSocket('wss://websocket.tobit.com');

        this.socket.onopen = this.onOpen;
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
    };

    /**
     * @private
     */
    emit = (event, data, wsEvent = null) => {
        if (typeof this.listener[event] === 'function') {
            this.listener[event](data, wsEvent);
        }
    };

    /**
     * @callback wsEventCallback
     * @param {Object} data
     * @param {MessageEvent} wsEvent
     */

    /**
     * Registers a new event handler for the given event name.
     * Overrides any previous event handler for this event.
     * @param {string} event - the name of the event
     * @param {wsEventCallback} listener - a callback that handles the event
     * @public
     */
    on = (event, listener) => {
        this.listener[event] = listener;
    };

    /**
     * @param {string} event - the name of the event
     * @public
     */
    off = (event) => {
        this.listener[event] = () => {};
    };

    /**
     * Registers a new event handler that is called once for the given event name.
     * @param {string} event - the name of the event
     * @param {wsEventCallback} listener - a callback that handles the event
     * @public
     */
    once = (event, listener) => {
        this.listener[event] = (data, wsEvent) => {
            listener(data, wsEvent);
            this.listener[event] = () => {};
        };
    };

    /**
     * Updates the conditions.
     * @param {Object} conditions
     * @public
     */
    updateConditions = (conditions) => {
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
        if (this?.socket && this?.socket?.close) {
            this?.socket?.close();
            this.onClose();
        }
    };
}

export default WebSocketClient;
