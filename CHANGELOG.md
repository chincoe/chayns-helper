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

* Fix request.fetch logConfig not working with an exact status code due to a faulty RegEx
