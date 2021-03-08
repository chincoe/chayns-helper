<a name="2.13.8"></a>
## [2.13.8](https://github.com/chincoe/chayns-helper/compare/v2.13.7...v2.13.8) (2021-03-08)

### Changes

* httpRequest
  * increase the character for request body, response body and resolve value to 5000

<a name="2.13.7"></a>
## [2.13.7](https://github.com/chincoe/chayns-helper/compare/v2.13.6...v2.13.7) (2021-03-08)

### Bug fixes

* useFullscreenTapp
  * fix setHeight "force" parameter

<a name="2.13.6"></a>
## [2.13.6](https://github.com/chincoe/chayns-helper/compare/v2.13.5...v2.13.6) (2021-03-05)

### Changes

* useFullscreenTapp
  * now accepts a config object which can be used to set styles
* Logging  
  * all non-preventable console.error logs are reduced to console.warn to avoid triggering console error listeners
  * request console.error logs for request.fetch are now reduced to console.warning if they have a LogLevel lower than 'error' in their logConfig
* WebsocketClient
  * WebsocketClient.socket is now public and can be accessed to e.g. get the current connection state

<a name="2.13.5"></a>
## [2.13.5](https://github.com/chincoe/chayns-helper/compare/v2.13.4...v2.13.5) (2021-03-04)

### Bug fixes

* httpRequest
  * Fix request.fetch logConfig not working with an exact status code due to a faulty RegEx
