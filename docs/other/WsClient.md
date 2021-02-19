## [WsClient](src/other/WsClient.ts)
A websocket client for the tobit websocket service. Should usually be used with [useWebsocketService](docs/hooks/useWebsocketService.md).

#### Constructor

| Parameter | Description | Type | Required/Default |
|-----------|-------------|--------|---------------|
| application | name of the service | string | required |
| conditions | the conditions that have to be met to receive a message | Object<string, string/number/boolean> | required |
| options.reconnectTimeout | timeout before reconnect | number | `5000` |
| options.checkConnectionInterval | interval in which the connection is checked | number | `2000` |

#### Public Properties

| Property | Description | Type |
|----------|-------------|------|
| conditions | the conditions under which the client is currently registered | Object<string,any> |
| connection | a counter used by useWebsocketService to count open connections per client | number |

#### Public Methods
* on(event, listener) - add an event listener

| Parameter | Description | Type | Required/Default |
|-----------|-------------|--------|---------------|
| event | name of the websocket event | string | required |
| listener | the event listener to handle the event, receives data and the MessageEvent | (data: Object, wsEvent: MessageEvent) => void | required |

* off(event) - remove the listener for an event
  
| Parameter | Description | Type | Required/Default |
|-----------|-------------|--------|---------------|
| event | name of the websocket event | string | required |
  
* once(event, listener) - add an event listener that is removed after running once

| Parameter | Description | Type | Required/Default |
|-----------|-------------|--------|---------------|
| event | name of the websocket event | string | required |
| listener | the event listener to handle the event, receives data and the MessageEvent | (data: Object, wsEvent: MessageEvent) => void | required |

* updateConditions(conditions) - set new conditions

| Parameter | Description | Type | Required/Default |
|-----------|-------------|--------|---------------|
| conditions | the conditions that have to be met to receive a message | Object<string, string/number/boolean> | required |

* closeConnection() - close the websocket connection

### Examples
```javascript
const wsClient = new WebSocketClient('my_service_name', {
    tappId: chayns.env.site.tapp.id
});
```
