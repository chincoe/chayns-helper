## [useWebsocketService](useWebsocketService.js)
Use the tobit websocket service client.
Uses only one client instance for all hooks unless otherwise specified via config.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|config| Configuration object | Object | required |
|config.serviceName | Name of the websocket service | string | required |
|config.conditions | WS Service conditions. Changing the conditions causes the client to unregister and register to the new conditions instead | Object | required |
|config.events | WS event listener. Format: <br>`{ [event_name]: (data, messageEvent) => { my code... } }` | Object<eventName,eventListener> | required|
|config.clientGroup | All hooks using the same client group use the same WS instance. By default every hook has the same clientGroup | string | `''` |
|config.waitForDefinedConditions | Wait with first register until all values of config.conditions is !== undefined | boolean | `true`|
|config.disconnectOnUnmount | Disconnect the WS client when unmounting the component. Use **only once per clientGroup**, preferably in the top level component | boolean | false |
|config.forceOwnConnection | Use a separate WS client instance for this hook. Overrides clientGroup. | boolean | `false` (`true` if in Wallet) |
|dependencies | dependencies for updating event listeners | Array<*> | [] |
| **@returns** | The used WebsocketClient instance | WsClient | |

Because all wallet items of the same system use the same script, all usages in the wallet need to have either `config.forceOwnConnection = true` or have `config.clientGroup` set to something unique to the wallet item (e.g. the wallet GUID).

#### Example
This example uses the service `'my_ws_service'` and listens for the websocket event `'send_data'`:
```javascript
const App = () => {
    const websocketClient = useWebsocketService({
        serviceName: 'my_ws_service',
        conditions: {
            tappId: chayns.env.site.tapp.id
        },
        events: {
            send_data: (data) => {
                console.log(data);
            }
        },
        disconnectOnUnmount: true
    }, [])


    return (<h1>Hello world</h1>)
};
```
