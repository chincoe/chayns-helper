## [Request](src/functions/httpRequest.js)

### request.fetch(address, config, processName, options)
A fetch helper function, meant to be called in a api js file (e.g. `getBoard.js`).

| Parameter              | Description                 | Type | Default / required |
|------------------------|-----------------------------|------|-----------|
|address| url of the fetch | string | required|
|config | Fetch config. Any property not documented here will be passed directly to fetch() as config | Object | `{}` |
|config.useChaynsAuth | Automatically add chayns bearer token auth | boolean | `chayns.env.user.isAuthenticated` |
|config.method| Method for the request | HttpMethod / string | `'GET'` |
|processName| Name of this request for all logs | string | `'HttpRequest'` |
|options| Options to configure the request helper | Object | `{}` |
|options.responseType | expected response format (json/blob/Object/Response) | ResponseType/string | `'json'` |
|options.logConfig | Configure the log level of specific status codes | Object<statusCode/regex, LogLevel> | `{"[1-3][\d]{2}":'info', 401: 'warning', "*": 'error'}`|
|options.ignoreErrors | Don't throw errors on error status codes, return null instead | boolean | `false` |
|options.useFetchApi | Use fetch(), use XMLHttpRequest otherwise  | boolean | `true` |
|options.stringifyBody | Call JSON.stringify() on config.body before passing it to fetch() | boolean | `true` |
|options.additionalLogData | This data will be logged with the request logs. Doesn't affect functionality at all | Object | `{}`|
|options.autoRefreshToken | Automatically repeat a request with config.useChaynsAuth if it fails due to expired access token after refreshing said access token | boolean | `true` |
|options.statusHandlers| Handle responses for specific status codes. Format: <br> 1.`{ [status/regex] : (response) => { my code }, ... }`<br> 2. `{ [status/regex] : responseType, ... }` | Object<status/regex, responseType/responseHandler> | `{}` |
|options.onProgress| Experimental feature: Callback that will allow you to monitor download progress | function | `null` |
|options.addHashToUrl | Add a random hash to the request url | boolean | `false`|

#### Examples
* Set logLevel for 3xx response status codes to warning and for 500 to critical
```javascript
const response = request.fetch(
    'https://www.example.com', 
    { method: HttpMethod.Post }, 
    'getExample', 
    {
        logConfig: {
            "3[0-9]{2}": LogLevel.warning,
            "500": LogLevel.critical
        }
    }
);
```
* Return null for 204 and 3xx and the error from the response body on 400
```javascript
const response = request.fetch(
    'https://www.example.com', 
    { method: HttpMethod.Post }, 
    'getExample', 
    {
        statusHandlers: {
            "(204)|3[0-9]{2}": (response) => null,
            "400": ResponseType.Json
        }   
    }
);
```

### request.handle(request, errorHandler, options)
A try/catch wrapper for a request, meant to be called e.g. in your redux thunk

| Parameter              | Description                 | Type | Default / required |
|------------------------|-----------------------------|------|-----------|
|request | The un-awaited promise of the request function | Promise | required |
|errorHandler | A handler that receives an error with status code. Handle error responses here. Pass undefined to use default| function(RequestError/Error, statusCode) | defaultErrorHandler from initChaynsHelper() |
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

#### Example
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

// both versions of getExample will return a Promise and thus will work with request.handle().

// calling getExample:
const result = await request.handle(
    getExample(data),
    (err, status) => {
        console.error('Request Error:', status, err)
    }, { waitCursor: true }
);
```

### request.ResponseType - enum
| Property | Value | Response |
|----------|-------| ------|
|Json| `'json'`| response.json()|
|Blob | `'blob'`| response.blob() |
|Response | `'response'` | response |
|Object | `'object'` | `{ status: response.status, data: await response.json() }` |
|Text | `'text'` | body string |
|None | `'none'` | `undefined`|

### request.LogLevel - enum
| Property | Value |
|----------|-------|
| info | `'info'`|
|warning | `'warning'`|
|error |`'error'`|
|critical| `'critical'`|
|none |`'none'`|

### request.HttpMethod - enum
```javascript
const HttpMethod = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Patch: 'PATCH',
    Delete: 'DELETE',
};
```

### request.RequestError extends Error
`constructor(message, statusCode)`

| Manual Property | value |
|---------------|---------------|
|name | `'HttpRequestError${statusCode}'`|
|statusCode | `statusCode` |
