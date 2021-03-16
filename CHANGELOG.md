<a name="2.14.0"></a>

## [2.14.0](https://github.com/chincoe/chayns-helper/compare/v2.13.9...v2.14.0) (2021-03-16)

### Changes

* Add RequestRegex, a collection of predefined Regexes to use as key in the request.fetch configs

* useFullscreenTapp
  * disableBodyScrolling is now optional
  * root element can now be a custom element instead of always being the element with the `'.tapp'` class
  
* TextString
  * initTextStrings now also loads the respective library and thus now returns a promise
  
* fnsFormat
  * improved localization
    * now uses TextString.language as language
    * now uses the right locale for the chosen language
    * useToday strings are now available in all TextString languages

### Bug fixes

* httpRequest
    * now correctly resolves with an object containing the status when failing to read the blob/json/etc. body
      for ResponseType JsonWithStatus/BlobWithStatus/etc. instead of `null`

<a name="2.13.9"></a>

## [2.13.9](https://github.com/chincoe/chayns-helper/compare/v2.13.8...v2.13.9) (2021-03-12)

### Changes

* Add chaynsCall enableBodyScroll
* useFullscreenTapp
    * use enableBodyScroll in addition to current workflow to disable scrolling. Does not work on iOS yet

### Bug fixes

* httpRequest
    * Fix color in debug logs

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
    * request console.error logs for request.fetch are now reduced to console.warning if they have a LogLevel lower
      than 'error' in their logConfig
* WebsocketClient
    * WebsocketClient.socket is now public and can be accessed to e.g. get the current connection state

<a name="2.13.5"></a>

## [2.13.5](https://github.com/chincoe/chayns-helper/compare/v2.13.4...v2.13.5) (2021-03-04)

### Bug fixes

* httpRequest
    * Fix request.fetch logConfig not working with an exact status code due to a faulty RegEx
