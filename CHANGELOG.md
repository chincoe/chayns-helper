<a name="2.16.7"></a>

## [2.16.7](https://github.com/chincoe/chayns-helper/compare/v2.16.1...v2.16.7) (2021-05-10)

### Changes

* Updated internal workflow for build and publish

<a name="2.16.1"></a>

## [2.16.1](https://github.com/chincoe/chayns-helper/compare/v2.16.0...v2.16.1) (2021-04-19)

### Bug fixes

* useFullscreenTapp
  * Settings like viewMode had their dependencies fixed to be immediately updated when changed


<a name="2.16.0"></a>

## [2.16.0](https://github.com/chincoe/chayns-helper/compare/v2.15.0...v2.16.0) (2021-04-15)

### Changes

* TextString
  * Added Polish language support for auto creation
  * Now uses a different endpoint to check for text strings that has reduced overhead  
  * initTextStrings
    * Now accepts a parameter `autoCreation` that can toggle autoCreation globally. This allows for enabling autoCreation for QA only or for specific cases in Development

* fnsFormat
  * Added Polish language support
  
* setViewMode
  * Added overload using an enum instead of 2 boolean parameters
  
* useFullscreenTapp
  * **[possibly breaking]** Removed parameters `activeStyle`, `inactiveStyle`, `forceExclusive`
  * Added parameters `style` and `viewMode`
  * Added the feature to supply a complete config object for `active` and `inactive` including `style` and `viewMode`
  * The inactive style to remove active styles is now calculated automatically
  
### Bug fixes

* TextString
  * **[critical]** Removed useless recursive text string search that created an infinite loop to check auto creation (since 2.13.4)

* setViewMode
  * Added null value handling for `chayns.env.site.disposition`

<a name="2.15.0"></a>

## [2.15.0](https://github.com/chincoe/chayns-helper/compare/v2.14.1...v2.15.0) (2021-04-09)

### Changes

* CenteredContainer
  * Now has a `vertical` property to change its direction
  
* DataRow
  * Improved styles with more padding and better vertical label alignment
  * Improved multirow structure
  * Additional `slim` property to revert to the previous style without padding
  
* TextString
  * now uses <p>-tag as default child instead of <span>
  
### Bug fixes

* useTimeoutState 
  * **[critical]** Fixed equality check condition - it was previously inverted, completely breaking this hook
  
* TextString
  * jsx replacements did not work properly with useDangerouslySetInnerHtml, because the html parser could not deal with the self-closing <span>-tag placeholder properly
  * className set to the children will no longer be overwritten by the className set by the chayns TextString component


<a name="2.14.1"></a>

## [2.14.1](https://github.com/chincoe/chayns-helper/compare/v2.14.0...v2.14.1) (2021-04-07)

### Changes

* httpRequest
  * RequestError.statusCode can now be accessed with RequestError.status as well to bring it in line with the JS Response object
  
* setViewMode
  * replace deprecated call 101 with call 266
  
* CenteredContainer
  * set width to 100% by default
  
* Websocket
  * improve useWebsocketService docs for using multiple hooks for the same service

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
