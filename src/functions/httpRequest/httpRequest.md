## [Request](httpRequest.js)

### request.fetch(address, config, processName, options)
A fetch helper function, meant to be called in an api js file (e.g. `getBoard.js`).

| Parameter              | Description                 | Type | Default / required |
|------------------------|-----------------------------|------|-----------|
|address| url of the fetch | string | required|
|config | Fetch config. Any property not documented here will be passed directly to fetch() as config | Object | `{}` |
|config.useChaynsAuth | Automatically add chayns bearer token auth | boolean | `chayns.env.user.isAuthenticated` |
|config.method| Method for the request | HttpMethod / string | `'GET'` |
|processName| Name of this request for all logs | string | `'HttpRequest'` |
|options| Options to configure the request helper | Object | `{}` |
|options.responseType | expected response format (json/blob/Object/Response) | ResponseType/string | `'json'` |
|options.logConfig | Configure the log level of specific status codes | Object<statusCode/regex, LogLevel> | `{"[1-3][\\d]{2}":'info', 401: 'warning', "[\\d]+": 'error'}`|
|options.ignoreErrors | Don't throw errors on error status codes, return null instead. Response types "Object" and "Response" will return an object that includes the status to make sure the status is always available. | boolean / Array<statusCode> | `false` |
|options.useFetchApi | Use fetch(), use XMLHttpRequest otherwise  | boolean | `true` |
|options.stringifyBody | Call JSON.stringify() on config.body before passing it to fetch() | boolean | `true` |
|options.additionalLogData | This data will be logged with the request logs. Doesn't affect functionality at all | Object | `{}`|
|options.autoRefreshToken | Automatically repeat a request with config.useChaynsAuth if it fails due to expired access token after refreshing said access token | boolean | `true` |
|options.statusHandlers| Handle responses for specific status codes using the codes or regex. Format: <br> 1.`{ [status/regex] : (response) => { my code }, ... }`<br> 2. `{ [status/regex] : responseType, ... }` | Object<status/regex, responseType/responseHandler> | `{}` |
|options.onProgress| *Experimental feature*: Callback that will allow you to monitor download progress | function | `null` |
|options.addHashToUrl | Add a random hash to the request url | boolean | `false`|
| **@returns** | Promise of: Response specified via response type or throws an error | Promise<Json/String/Object/Blob/Response/null> | |

> **Note**: A "Failed to fetch" Error will be treated as a status code `1` regarding options.statusHandlers, options.logConfig as well as the return values if options.ignoreErrors is true 

> **Note**: The priority for statusHandlers is based on object key order.
> Exceptions:
> * Specific options will always have a higher priority than the defaults
> * Keys that target a single status have higher priority than a regex key
> 
> To keep the proper order, please make sure to specify all regex keys like `{[/myRegex/]: ...}` and **not** like `{'myRegex': ...}`.
> The second notation might still work but will result in issues regarding priorities compared to single status code handlers or other regexes.

#### Default behavior
This helper works with the following presumptions:

 * Responses with status < 400 are usually a success
 * Responses with status >= 400 are usually errors and will thus throw an error / reject the promise

This behavior makes it necessary to wrap a request into `try/catch` or define a `.catch` on the promise.
`request.handle()` is the preferred try/catch-wrapper to handle these errors.

`request.handle()` will still reject the Promise on error by default, thus code after the request may not be executed.


#### Examples
* Set logLevel for 3xx response status codes to warning, 4xx to error and for 500 to critical
```javascript
const response = request.fetch(
    'https://www.example.com', 
    { method: request.method.Post }, 
    'getExample', 
    {
        logConfig: {
            [/3[0-9]{2}/]: request.LogLevel.warning,
            // computed property names using regex are viable as well
            [/4[\d]/]: request.LogLevel.error,
            500: request.LogLevel.critical
        }
    }
);
```
* Return null for 204 and 3xx and the error from the response body on 400
```javascript
const response = request.fetch(
    'https://www.example.com', 
    { method: request.method.Post }, 
    'getExample', 
    {
        statusHandlers: {
            [/(204)|3[0-9]{2}/]: (response) => null,
            400: request.responseType.Json
        }   
    }
);
```

### request.defaults(address, config, options)
Set a base url as well as defaults for fetch config and request.fetch()-options.

| Parameter              | Description                 | Type | Default / required |
|------------------------|-----------------------------|------|-----------|
| address | A base url. Will be used as prefix to the address in request.fetch() if:<br> - This default address starts with a protocol (e.g. `https://`)<br> - The request address doesn't start with a protocol <br> - The request address starts with a `/` | string | `''` |
| config | A fetch config object. See request.fetch() for all properties. Properties that are not specified will keep their default value | Object | `{}` |
| options | A request.fetch() options object. See request.fetch() for all properties. Properties that are not specified will keep their default value | Object | `{}` |

##### Example
```javascript
// index.jsx

// set base url and some default config and options
request.defaults('https://example.server.com/MyApp/v1.0', // notice how the base url can't end with a slash
    {
        useChaynsAuth: false,
        cache: 'no-cache'
    },
    {
        // always get Object with json body and status unless otherwise specified
        responseType: request.responseType.Object,
        // log 2xx as info, 3xx as warning, 401 as warning and anything else as error
        logConfig: {
            [/2[\d]{2}/]: 'info',
            [/3[\d]{2}/]: 'warning',
            401: 'warning',
            [/[\d]+/]: 'error'
        },
        // don't try to get json body on 204
        statusHandlers: {
            204: request.responseType.Response
        }
    }
);

/* ... */

// myRequest.js

// usage for base url
request.fetch('/controller/endpoint/boardId', {}, 'myRequest'); // notice how the url has to start with a slash to use the base url
```

### request.handle(request, errorHandler, options)
A try/catch wrapper for a request, meant to be called e.g. in your redux thunk

| Parameter              | Description                 | Type | Default / required |
|------------------------|-----------------------------|------|-----------|
|request | The un-awaited promise of the request function | Promise | required |
|errorHandler | A handler that receives an error with status code as well as resolve and reject to determine the result of the entire promise. Handle error responses here. Pass undefined to use default| function(RequestError/Error, statusCode, resolve, reject) | defaultErrorHandler from initChaynsHelper() |
|options | Options to configure the request handling with | Object | `{}` |
|options.finallyHandler | function to always be executed after the request is done | function() | `() => null`|
|options.waitCursor| Show a waitcursor during the request. Use an object for more detailed config | bool/waitCursorObject | `false`|
|options.waitCursor.text | text to be shown in the wait cursor after a certain time | string | chayns default |
|options.waitCursor.textTimeout | timeout in ms after which the text will be shown | number | `5000`|
|options.waitCursor.timeout | timeout after which the waitcursor will be shown |number | `300`|
|options.cache| Cache the request using local storage. Use null to disable. Pass a string to configure only cache.key | null/string/Object | `null` |
|options.cache.key | localStorage key | string | required if cache is Object |
|options.cache.duration | duration in minutes to cache this request | number | `5` |
|options.cache.cacheResolver | function that receives the request result and should format it into a serializable object | function(response/Object/json/blob/null) | `(v) => v` |
|options.noReject | Do not reject on error, resolve with null instead. Ensures that code after request.handle() will always be executed | boolean | `false` |
| **@returns** | Promise of request result | Promise<*> | |


#### Example
```javascript
// getExample.js
const getExample = (data) => {
    return request.fetch(
        'https://www.example.com', 
        { 
            method: request.method.Post,
            body: data
        }, 
        'getExample'
    );
}
// OR:
const getExample = async (data) => {
    const result = await request.fetch(
        'https://www.example.com', 
        {
            method: request.method.Post,
            body: data
        }, 
        'getExample'
    );
    // do stuff with the result here ...
    return result;
}

// both versions of getExample will return a Promise and thus will work with request.handle().

// calling getExample:
const result = await request.handle(
    getExample(data),
    (err, status) => {
        console.error('Request Error:', status, err)
    }, { waitCursor: true }
);
```

### request.responseType - enum
> Exported as `ResponseType` and `request.responseType`

| Property | Value | Response |
|----------|-------| ------|
|Json| `'json'`| response.json()|
|Blob | `'blob'`| response.blob() |
|Response | `'response'` | response |
|Object | `'object'` | `{ status: response.status, data: await response.json() }` |
|Text | `'text'` | body string |
|None | `'none'` | `undefined`|
|Error | `'error'` | RequestError |

### request.logLevel - enum
> Exported as `LogLevel` and `request.logLevel`

| Property | Value |
|----------|-------|
| info | `'info'`|
|warning | `'warning'`|
|error |`'error'`|
|critical| `'critical'`|
|none |`'none'`|

### request.method - enum
> Exported as `HttpMethod` and `request.method`

```javascript
const HttpMethod = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Patch: 'PATCH',
    Delete: 'DELETE',
};
```

### request.error extends Error
> Exported as `RequestError` and `request.error`

`constructor(message, statusCode)`

| Manual Property | value |
|---------------|---------------|
|name | `'HttpRequestError${statusCode}'`|
|statusCode | `statusCode` |

### request.presets
A collection of presets for request.defaults()

| Name | Description |
|----------|-------|
| default | the default config |
| extended | An extended and suggested config, including noCache, JsonObject response type and Status 204 handling |
| strict | Any status not explicitly handled is treated as an error |
| noErrors | Don't throw any errors, only log them and return the response |

Details:

```javascript
const requestPresets = {
    // the default config
    default: {
        config: {
            useChaynsAuth: chayns.env.user.isAuthenticated
        },
        options: {
            responseType: ResponseType.Json,
            logConfig: {
                [/[1-3][\d]{2}/]: LogLevel.info,
                401: LogLevel.warning,
                [/[\d]+/]: LogLevel.error
            },
            ignoreErrors: false,
            useFetchApi: true,
            stringifyBody: true,
            additionalLogData: {},
            autoRefreshToken: true,
            statusHandlers: {},
            onProgress: null,
            addHashToUrl: false,
            showDialogs: true
        }
    },
    // an extended config, suggested for use
    extended: {
        config: {
            cache: 'no-cache',
            headers: {
                CacheControl: 'no-cache',
                Pragma: 'no-cache'
            }
        },
        options: {
            responseType: ResponseType.Object,
            logConfig: {
                [/2[\d]{2}/]: LogLevel.info,
                [/3[\d]{2}/]: LogLevel.warning,
                401: LogLevel.warning,
                [/[\d]+/]: LogLevel.error,
                [/.*/]: LogLevel.critical
            },
            ignoreErrors: false,
            useFetchApi: true,
            stringifyBody: true,
            additionalLogData: {},
            autoRefreshToken: true,
            statusHandlers: {
                204: ResponseType.Response,
                [/3[\d]{2}/]: ResponseType.Response
            },
            onProgress: null,
            addHashToUrl: false,
            showDialogs: false
        }
    },
    // a strict config: Anything not explicitly expected is an error
    strict: {
        config: {
            cache: 'no-cache'
        },
        options: {
            responseType: ResponseType.Json,
            logConfig: {
                200: LogLevel.info,
                [/[\d]+/]: LogLevel.error,
                [/.*/]: LogLevel.critical
            },
            statusHandlers: {
                [/(?!200)/]: ResponseType.Error
            },
            ignoreErrors: false,
            useFetchApi: true,
            stringifyBody: true,
            additionalLogData: {},
            autoRefreshToken: false,
            onProgress: null,
            addHashToUrl: false,
            showDialogs: false
        }
    },
    // a config that prevents throwing any errors, but not logging them
    noErrors: {
        config: {
            cache: 'no-cache'
        },
        options: {
            responseType: ResponseType.Object,
            logConfig: {
                [/2[\d]{2}/]: LogLevel.info,
                [/3[\d]{2}/]: LogLevel.warning,
                401: LogLevel.warning,
                [/[\d]+/]: LogLevel.error,
                [/.*/]: LogLevel.critical
            },
            ignoreErrors: true,
            useFetchApi: true,
            stringifyBody: true,
            additionalLogData: {},
            autoRefreshToken: true,
            statusHandlers: {
                204: ResponseType.Response,
                [/2[\d]{2}/]: ResponseType.Object,
                [/.*/]: ResponseType.Response
            },
            onProgress: null,
            addHashToUrl: false,
            showDialogs: false
        }
    }
};
```

### request.full(address, config, processName, options, errorHandler, handlerOptions)
A combined function of request.handle() and request.fetch()

