# [Request](src/functions/httpRequest/httpRequest.ts)

A request helper with customizable defaults that can be used to configure any behavior. Includes the request helper as
well as enums for http methods, http status codes and more.

## Table of Contents
- [Suggested setup and quick documentation](#suggested-setup-and-quick-documentation)
- [request.fetch(address, config, processName, options)](#requestfetchaddress-config-processname-options)
   * [Response handling priority](#response-handling-priority)
      + [ThrowError behavior](#throwerror-behavior)
      + [Handling errors with throwErrors = true](#handling-errors-with-throwerrors--true)
   * [Examples](#examples)
   * [Customizing Logging](#customizing-logging)
- [request.defaults(address, config, options)](#requestdefaultsaddress-config-options)
   * [Example](#example)
- Other Exports
    * [ResponseType | request.responseType](#responsetype--requestresponsetype)
    * [LogLevel | request.logLevel](#loglevel--requestloglevel)
    * [HttpMethod | request.method](#httpmethod--requestmethod)
    * [RequestError | request.error extends Error](#requesterror--requesterror-extends-error)
    * [ChaynsError extends RequestError](#chaynserror-extends-requesterror)
    * [isChaynsError(value)](#ischaynserrorvalue)
    * [getChaynsErrorCode(value)](#getchaynserrorcodevalue)
    * [HttpStatusCode](#httpstatuscode)

## Suggested setup and quick documentation

If you've never used this helper before and just want a basic fetch helper, I suggest the following setup:

```javascript
// index.js
async function init() {
    // chayns ready, logger init goes here
    request.defaults("BASE_URL",
        {
            // your default fetch config, e.g. header
        }, {
            responseType: ResponseType.JsonWithStatus // configures reques.fetch to return an object with the status and json body
        }
    )
    // render goes here
}

// postData.js
export default async function postData(body) {
    const result = await request.fetch(
        "/my/url/##locationId##/##tappId##/##siteId##", // route, prefixed with base url if it doesn't start with "http[s]://" or another protocol
        {   // fetch config, almost identical to the 2nd param of the built-in fetch() function
            method: HttpMethod.Post, // default "GET"
            body: body,
            useChaynsAuth: false // add user token as auth header. Default: chayns.env.user.isAuthenticated
        },
        "postData", // for your request logs
        {
            // only worry about these options if you want to:
            // * customize the helper's behavior 
            // * use something rerender than json in your request or response bodies
            // * adjust the logLevel for request logs depending on status code
            // * get the response body from requests without success status code
            // * handle ChaynsErrors
        }
    );
    // data is the result of  response.json() (if available), status is the statusCode. Failed to fetch is status 1.
    const {
        data,
        status
    } = result;
}
```

## request.fetch(address, config, processName, options)

A fetch helper function, meant to be called in an api js file (e.g. `getBoard.js`).

| Parameter              | Description                 | Type | Default / required |
|------------------------|-----------------------------|------|-----------|
|address| url of the fetch | string | required|
|config | Fetch config. Any property not documented here will be passed directly to fetch() as config | Object | `{}` |
|config.useChaynsAuth | Automatically add chayns bearer token auth | boolean | `chayns.env.user.isAuthenticated` |
|config.method| Method for the request | HttpMethod / string | `'GET'` |
|processName| Name of this request for all logs | string | `'HttpRequest'` |
|options| Options to configure the request helper | Object | `{}` |
|options.responseType | expected response format (json/blob/Response/etc.) | ResponseType/string | `'json'` |
|options.logConfig | Configure the log level of specific status codes | Object\<statusCode/regex, LogLevel> | `{"[1-3][\\d]{2}":'info', 401: 'warning', "[\\d]+": 'error'}`|
|options.throwErrors | Throw an error on error status codes instead of returning null. Response types "Object" and "Response" will return an object that includes the status to make sure the status is always available. Passing an array will set throwErrors to `true` unless it's one of the status codes in the array | boolean / Array\<statusCode> | `false` |
|options.stringifyBody | Call JSON.stringify() on config.body before passing it to fetch() and set the Content-Type header if a body is specified. You can pass an object with [JsonSettings](docs/functions/getJsonSettings.md#JsonSettings) as well to customize serialization | boolean/JsonSettings | `true` |
|options.additionalLogData | This data will be logged with the request logs. Doesn't affect functionality at all | Object | `{}`|
|options.autoRefreshToken | Automatically repeat a request with config.useChaynsAuth if it fails due to expired access token after refreshing said access token | boolean | `true` |
|options.statusHandlers| Handle responses for specific status codes using the codes or regex. Format: <br> 1.`{ [status/regex] : (response) => { my code }, ... }`<br> 2. `{ [status/regex] : responseType, ... }` | Object\<status/regex, responseType/responseHandler> | `{}` |
|options.errorHandlers| Handle responses for specific ChaynsErrors using the errorCodes or regex. Format: <br> 1.`{ [code/regex] : (response) => { my code }, ... }`<br> 2. `{ [code/regex] : responseType, ... }` | Object\<errorCode/regex, responseType/responseHandler> | `{}` |
|options.errorDialogs| Array of ChaynsError codes or regexes for codes that should display their respective dialog | Array<string/regex> | `[]` |
|options.waitCursor | Show a wait cursor during the request. Can be configured like [showWaitCursor()](docs/functions/waitCursor.md) | boolean / [{text,timeout,textTimeout} / {timeout,steps}](docs/functions/waitCursor.md) | `false` |
|options.replacements | Replacements for the request url | Object<string/regex, string/function> | Object with replacements for `##locationId##`, `##siteId##`, `##tappId##`, `##userId##` and `##personId##`  |
|options.sideEffects | Side effects for certain status codes, like chayns.login() on status 401. Pass a function to handle all status at once or an object with an effect for each status  | function(status) / Object\<status: number, function> | `undefined` |
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

#### Handling errors with throwErrors = true

To handle side effects of failed requests when throwErrors is enabled, consider using the JS Promise
functions `.then(successFn, errorFn)`, `.catch(errorFn)` and `.finally(alwaysFn)`.

### Examples

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

* Handling failed requests with options.throwErrors = true

```javascript
// getExample.js
const getExample = (data) => {
    return request.fetch(
        'https://www.example.com',
        {
            method: HttpMethod.Post,
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
            method: HttpMethod.Post,
            body: data
        },
        'getExample'
    );
    // do stuff with the result here ...
    return result;
}

// calling getExample:
const result = await (getExample(data).catch((ex) => {
    // handle error for your application
    throw ex;
}));
```

### Customizing Logging

This helper offers extensive request logging. In case your application deals with sensitive data, you can filter out
that data in a logger middleware in your `chayns-logger`.

A chayns-logger middleware can be passed in the chaynsLogger.init function and looks like this:

```javascript
chaynsLogger.init({
    // ...
    middleware(payload) {
        // modify payload
        return true; // return false to prevent this log entirely
    }
})
```

For the purposes of this helper, your can identify every log like this:

```javascript
function middleware(payload) {
    if (payload.section === '[chayns-helper]httpRequest.js') {
        // deal with any log by the request helper
    }
}
```

Not all logs are request logs, but only really request logs contain information that could be considered sensitive (call
parameters, headers, request and response bodies, authorization header). To enable you to target specific fields to
remove from your log, the structure of a request log payload always looks like this:
```javascript
const payload = {
    data: {
        processName,
        request: {
            address: "https://...",
            method: "GET",
            body: requestBody,
            headers: {
                // all custom set request headers
                Authorization: "..."
            }
        },
        response: {
            status,
            statusText,
            type, // the js Response type, e.g. "basic", "cors" or "opaque"
            requestUid, // the "X-Request-Id"-Header,
            body: responseBody,
            url: responseUrl
        },
        input: { address, config, options }, // the input parameters for this specific request.fetch() call
        online: `true, 3g`,
        requestDuration: "300 ms",
        requestTime: "ISO Format Date string",
        internalRequestGuid,
        additionalLogData
    },
    section: '[chayns-helper]httpRequest.js',
    // other non specific meta information
}
```

Not all fields will always be available depending on the request data.

## request.defaults(address, config, options)

Set a base url as well as defaults for fetch config and request.fetch()-options.

| Parameter              | Description                 | Type | Default / required |
|------------------------|-----------------------------|------|-----------|
| address | A base url. Will be used as prefix to the address in request.fetch() if:<br> - This default address starts with a protocol (e.g. `https://`)<br> - The request address doesn't start with a protocol | string | `''` |
| config | A fetch config object. See request.fetch() for all properties. Properties that are not specified will keep their default value | Object | `{}` |
| options | A request.fetch() options object. See request.fetch() for all properties. Properties that are not specified will keep their default value | Object | `{}` |

By default, if a field in options or config is set on a specific request it will overwrite the default set with this
function entirely. There are some important exceptions where defaults and specific options are merged, with the specific
taking priority over the default:

* request.headers
* options.statusHandlers
* options.errorHandlers
* options.logConfig
* options.stringifyBody
* options.sideEffects
* options.replacements

### Example

```javascript
// index.jsx

// set base url and some default config and options
request.defaults(
    'https://example.server.com/MyApp/v1.0',
    {
        useChaynsAuth: false,
        cache: 'no-cache'
    },
    {
        // always get Object with json body and status unless otherwise specified
        responseType: ResponseType.JsonWithStatus,
        // log 2xx as info, 3xx as warning, 401 as warning and anything else as error
        logConfig: {
            [/2[\d]{2}/]: LogLevel.info,
            [/3[\d]{2}/]: LogLevel.warning,
            401: LogLevel.warning,
            [/[\d]+/]: LogLevel.error
        },
        // don't try to get json body on 204
        statusHandlers: {
            204: ResponseType.Response
        }
    }
);

/* ... */

// myRequest.js

// usage for base url
request.fetch('/controller/endpoint/boardId', {}, 'myRequest');
```

## ResponseType | request.responseType

> Exported as `ResponseType` and `request.responseType`

| Property | Value | Response |
|----------|-------| ------|
|Json| `'json'`| response.json()|
|Blob | `'blob'`| response.blob() |
|Binary | `'binary'`| response.arrayBuffer() |
|Response | `'response'` | response |
|Object(**deprecated**) | `'object'` | `{ status: response.status, data: await response.json() }` |
|Text | `'text'` | response.text() |
|None | `'none'` | `undefined`|
|ThrowError | `'error'` | RequestError/ChaynsError |
|JsonWithStatus | `'status_json'` | `{ status: response.status, data: await response.json() }` |
|BlobWithStatus | `'status_blob'` | `{ status: response.status, data: await response.blob() }` |
|TextWithStatus | `'status_text'` | `{ status: response.status, data: await response.text() }` |
|NoneWithStatus | `'status_none'` | `{ status: response.status, data: undefined }` |
|BinaryWithStatus | `'status_binary'` | `{ status: response.status, data: await response.arrayBuffer() }` |

> ResponseType.Object is deprecated and will be removed in a future release.

## LogLevel | request.logLevel

> Exported as `LogLevel` and `request.logLevel`

| Property | Value |
|----------|-------|
| info | `'info'`|
|warning | `'warning'`|
|error |`'error'`|
|critical| `'critical'`|
|none |`'none'`|

## HttpMethod | request.method

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

## RequestError | request.error extends Error

> Exported as `RequestError` and `request.error`

`constructor(message, statusCode)`

| Class member | value |
|---------------|---------------|
|name | `'HttpRequestError${statusCode}'`|
|statusCode | `statusCode` |

## ChaynsError extends RequestError

`constructor({ displayMessage, errorCode, parameters, requestId }, processName, status)`

| Class member | value |
|---------------|---------------|
|name | `'ChaynsError/{errorCode}'`|
|statusCode | `{status}` |
|displayMessage | `displayMessage` |
|errorCode | `errorCode` |
|parameters | `parameters` |
|requestId | `requestId` |

## isChaynsError(value)
Check whether the value (e.g. an object or a Response) is a ChaynsError object

## getChaynsErrorCode(value)
Try to get the ChaynsError error code from a value like an object or a Response

## HttpStatusCode

An enum of HTTP Status Codes

