## [useWebsocketService](src/hooks/useWebsocketService.ts)
Use the tobit websocket service client.
Uses only one client instance for all hooks unless otherwise specified via config.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|config| Configuration object | Object | required |
|config.serviceName | Name of the websocket service | string | required |
|config.conditions | WS Service conditions. Changing the conditions causes the client to unregister and register to the new conditions instead | Object<string, string/number/boolean> | required |
|config.events | WS event listener. Format: <br>`{ [topic]: (data, messageEvent) => { my code... } }` | Object<string,function> | required|
|config.clientGroup | All hooks using the same client group and service name use the same WS instance. By default every hook for the same service has the same clientGroup | string | `''` |
|config.waitForDefinedConditions | Wait with first register until all values of config.conditions are !== undefined | boolean | `true`|
|config.forceDisconnectOnUnmount | Disconnect the websocket when this component unmounts. Affects all hooks using with the same clientGroup. Disconnects after the last hook unmounts if set to false. | boolean | false |
|config.forceOwnConnection | Use a separate WS client instance for this hook. Overrides clientGroup. | boolean | `false` (`true` if in Wallet) |
|dependencies | dependencies for updating event listeners | Array\<any> | [] |
| **@returns** | The used WebsocketClient instance | WebSocketClient | |

> NOTE: Because all wallet items of the same system use the same script, all usages in the wallet need to have either `config.forceOwnConnection = true` or have `config.clientGroup` set to something unique to the wallet item (e.g. the wallet GUID).

### Examples

This example uses the service `'my_ws_service'` and listens for the websocket event `'send_data'`:

```javascript
// simple implementation
const App = () => {
    const websocketClient = useWebsocketService({
        serviceName: 'my_ws_service',
        conditions: {
            tappId: chayns.env.site.tapp.id
        },
        events: {
            send_data(data) {
                console.log(data);
            }
        }
    }, [])

    return (<h1>Hello world</h1>)
};

// wallet implementation using own connection
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
        forceOwnConnection: true
    }, [])

    return (<h1>Hello world</h1>)
};
// or using the wallet guid as client group
const App = ({ id }) => {
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
        clientGroup: id
    }, [])

    return (<h1>Hello world</h1>)
};
```

