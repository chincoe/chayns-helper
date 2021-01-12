## [Request](httpRequest.ts)

### Suggested setup and quick documentation

If you've never used this helper before and just want a basic fetch helper, I suggest the following setup:

```javascript
// index.js
async function init() {
    // chayns ready, logger init goes here
    request.defaults("BASE_URL",
        {
            // your default fetch config, e.g. header
        }, {
            responseType: ResponseType.Object // configures reques.fetch to return an object with the status and json body
        }
    )
    // render goes here
}

// postStuff.js
export default async function postStuff(body) {
    const result = await request.fetch(
        "/my/url/##locationId##/##tappId##/##siteId##", // route, has to start with a "/" to use the base url from index.js
        {   // fetch config, almost identical to the 2nd param of the built-in fetch() function
            method: HttpMethod.Post, // default "GET"
            body: body,
            useChaynsAuth: false // true: adds user token as Auth header if user is logged in by default
        },
        "postStuff", // for your request logs
        {
            // only worry about these options if you want to:
            // * customize the helper's behavior 
            // * use something other than json
            // * adjust the logLevel for request logs depending on status code
            // * get the response body from requests without success status code
            // * handle ChaynsErrors
        }
    );
    // data is the response.json() (if available), status the the response statusCode. Failed to fetch is status 1.
    const {
        data,
        status
    } = result;
}
```

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
|options.logConfig | Configure the log level of specific status codes | Object\<statusCode/regex, LogLevel> | `{"[1-3][\\d]{2}":'info', 401: 'warning', "[\\d]+": 'error'}`|
|options.throwErrors | Throw an error on error status codes instead of returning null. Response types "Object" and "Response" will return an object that includes the status to make sure the status is always available. Passing an array will set throwErrors to `true` unless it's one of the status codes in the array | boolean / Array\<statusCode> | `false` |
|options.stringifyBody | Call JSON.stringify() on config.body before passing it to fetch() and set the Content-Type header if a body is specified | boolean | `true` |
|options.additionalLogData | This data will be logged with the request logs. Doesn't affect functionality at all | Object | `{}`|
|options.autoRefreshToken | Automatically repeat a request with config.useChaynsAuth if it fails due to expired access token after refreshing said access token | boolean | `true` |
|options.statusHandlers| Handle responses for specific status codes using the codes or regex. Format: <br> 1.`{ [status/regex] : (response) => { my code }, ... }`<br> 2. `{ [status/regex] : responseType, ... }` | Object\<status/regex, responseType/responseHandler> | `{}` |
|options.errorHandlers| Handle responses for specific ChaynsErrors using the errorCodes or regex. Format: <br> 1.`{ [code/regex] : (response) => { my code }, ... }`<br> 2. `{ [code/regex] : responseType, ... }` | Object\<errorCode/regex, responseType/responseHandler> | `{}` |
|options.errorDialogs| Array of ChaynsError codes or regexes for codes that should display their respective dialog | Array<string/regex> | `[]` |
|options.waitCursor | Show a wait cursor during the request. Can be configured like [showWaitCursor()](src/functions/waitCursor/waitCursor.md) | boolean/{text: string, timeout: number, textTimeout: number}/{timeout: number, steps: Object\<textTimeout, text> } | `false` |
|options.replacements | Replacements for the request url | Object<string/regex, string/function> | Object with replacements for `##locationId##`, `##siteId##`, `##tappId##`, `##userId##` and `##personId##`  |
|options.sideEffects | Side effects for certain status codes, like chayns.login() on status 401. Pass a function to handle all status at once or an object with an effect for each status  | (status: number) => void / Object\<status: number, () => void> | `undefined` |
| **@returns** | Promise of: Response specified via response type or throws an error | Promise\<Json/String/Object/Blob/Response/null> | |

> **Note**: A "Failed to fetch" Error will be treated as a status code `1` regarding options.statusHandlers, options.logConfig as well as the return values if options.throwErrors is false

> **Note**: The priority for statusHandlers is based on object key order.
> Exceptions:
> * Specific options will always have a higher priority than the defaults
> * Keys that target a single status have higher priority than a regex key
>
> To keep the proper order, please make sure to specify all regex keys like `{[/myRegex/]: ...}` and **not** like `{'myRegex': ...}`.
> The second notation might still work but will result in issues regarding priorities compared to single status code handlers or other regexes.

> **Note**: `options.replacements` defaults will always be overwritten entirely if you pass it, so passing an empty object disables it.
> request.defaults has the same behavior here.
> If you use regexes as key you should pass teh "g" flag to replace all occurrences.

### Response handling priority

In some cases, multiple different options that determine the response handling or response type will fit to a single
response. Since only one option can be applied, some options take priority over others. This list shows the order of
priority:

1. **options.errorHandlers** for ChaynsErrors
2. **options.statusHandlers** for a status code
3. **options.responseType** as a default
4. **ResponseType.Response** as fallback

If several statusHandlers or errorHandlers match the response, the priority within those handlers will be as following:

1. handlers passed to request.fetch()
   1. exact status/error code
   2. regex matching status/error code
2. handlers passed to request.defaults()
   1. exact status/error code
   2. regex matching status/error code
   
Otherwise, the priority is based on the order in which the handlers are specified.

#### ThrowError behavior

options.throwErrors is deactivated by default.

If throwErrors is set to true (or an array), this helper works with the following presumptions:

* Responses with status < 400 are usually a success
* Responses with status >= 400 are usually errors and will thus throw an error / reject the promise

This behavior makes it necessary to wrap a request into `try/catch` or define a `.catch` on the promise.

### Handling errors with throwErrors = true
Formerly done with ~~request.handle(request, errorHandler, options)~~.
This function is deprecated since v2.3.0.

To handle side effects of failed requests when throwErrors is activated, consider using the JS Promise functions `.then(successFn, errorFn)`, `.catch(errorFn)` and `.finally(alwaysFn)`.

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

// calling getExample:
const result = await (getExample(data).catch((ex) => {
    // handle error side effects like chayns.login() on status 401
    throw ex;
}));
```

#### Handling errors with throwErrors = true
To handle side effects of failed requests when throwErrors is enabled, consider using the JS Promise functions `.then(successFn, errorFn)`, `.catch(errorFn)` and `.finally(alwaysFn)`.

##### Example

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

// calling getExample:
const result = await (getExample(data).catch((ex) => {
    // handle error side effects like chayns.login() on status 401
    throw ex;
}));
```

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

* Return null for 204 and 3xx and the error from the response body on 400, call chayns.login on status 401

```javascript
const response = request.fetch(
    'https://www.example.com',
    { method: request.method.Post },
    'getExample',
    {
        statusHandlers: {
            [/(204)|3[0-9]{2}/]: (response) => null,
            400: request.responseType.Json
        },
        sideEffects: {
            401: () => { if (!chayns.env.user.isAuthenticated) chayns.login() }
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
request.defaults(
    'https://example.server.com/MyApp/v1.0', // notice how the base url can't end with a slash
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

### ResponseType | request.responseType - enum

> Exported as `ResponseType` and `request.responseType`

| Property | Value | Response |
|----------|-------| ------|
|Json| `'json'`| response.json()|
|Blob | `'blob'`| response.blob() |
|Response | `'response'` | response |
|Object | `'object'` | `{ status: response.status, data: await response.json() }` |
|Text | `'text'` | body string |
|None | `'none'` | `undefined`|
|Error | `'error'` | RequestError/ChaynsError |

### LogLevel | request.logLevel - enum

> Exported as `LogLevel` and `request.logLevel`

| Property | Value |
|----------|-------|
| info | `'info'`|
|warning | `'warning'`|
|error |`'error'`|
|critical| `'critical'`|
|none |`'none'`|

### HttpMethod | request.method - enum

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

### RequestError | request.error extends Error

> Exported as `RequestError` and `request.error`

`constructor(message, statusCode)`

| Class member | value |
|---------------|---------------|
|name | `'HttpRequestError${statusCode}'`|
|statusCode | `statusCode` |

### ChaynsError extends RequestError

`constructor({ displayMessage, errorCode, parameters, requestId }, processName, status)`

| Class member | value |
|---------------|---------------|
|name | `'ChaynsError/{errorCode}'`|
|statusCode | `{status}` |
|displayMessage | `displayMessage` |
|errorCode | `errorCode` |
|parameters | `parameters` |
|requestId | `requestId` |

### request.full(address, config, processName, options, errorHandler, handlerOptions)

A combined function of request.handle() and request.fetch()

### HttpStatusCode

An enum of HTTP Status Codes

