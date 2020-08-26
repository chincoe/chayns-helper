/* eslint-disable no-unused-vars */
/**
 * @type {boolean}
 * @public
 */
const __LIVE__ = true;
/**
 * @type {boolean}
 * @public
 */
const __DEVELOPMENT__ = true;
/**
 * @type {boolean}
 * @public
 */
const __DEV__ = true;
/**
 * @type {boolean}
 * @public
 */
const __STAGING__ = true;
/**
 * @type {boolean}
 * @public
 */
const __QA__ = true;
/**
 * @type {boolean}
 * @public
 */
const __PROD__ = true;
/**
 * @type {boolean}
 * @public
 */
const __PRODUCTION__ = true;

/**
 * @typedef userResult {{Type: number, PersonID: string, FacebookID: number, FirstName: string, UserID: number,
 *     LastName: string, ChaynsLogin: null, UserFullName: string}}
 */

/**
 * @typedef logoutType {{FALSE: number, NORMAL: number}}
 */

/**
 * @typedef loginState {{FACEBOOK: number, T_WEB: number, CANCEL: number, ALREADY_LOGGED_IN: number}}
 */

/**
 * @typedef cameraType {{AUTO: number, BACK: number, FRONT: number}}
 */

/**
 * @typedef geoLocation {{latitude: number, accuracy: number, speed: number, longitude: number}}
 */

/**
 * @typedef sharingConfig {{title: string, text: string, imageUrl: string, sharingApp: number, sharingAndroidApp:
 *     string}}
 */

/**
 * @typedef windowMetrics {{pageYOffset: number, windowHeight: number, frameX: number, scrollTop: number, frameY:
 *     number, height: number}}
 */

/**
 * @typedef sharingServicesResult {{retval:{availableSharingApps: [number]}}}
 */

/**
 * @typedef intercomConfig {{text: string}}
 */

/**
 * @typedef subTappConfig {{tappID: number, name: string, color: string, colorText: string, sortID: number, icon:
 *     string, callbackURL: function, url: string, buttonName: string, isExclusiveView: boolean, replaceParent:
 *     boolean, boldText: boolean}}
 */

/**
 * @typedef removeSubTappConfig {{tappID: number, close: boolean, remove: boolean}}
 */

/**
 * @typedef setHeightConfig {{height: int, growOnly: boolean, full: boolean, fullViewport: boolean, forceHeight:
 *     boolean}}
 */

/**
 * @typedef findPersonResult {{Status: {ResultCode: number, ResultText: string, Exception: undefined}, Value: [{name:
 *     string, personId: string, facebookId: number, lastLoginTime: string, currentLocationId: number}]}}
 */

/**
 * @typedef findSiteResult {{Status: {ResultCode: number, ResultText: string, Exception: undefined}, Value: [{siteId:
 *     string, locationId: number, appstoreName: string}]}}
 */

/**
 * @typedef floatingButtonConfig {{callback: function, text:string, color: string, colorText:string, icon: string,
 *     position: int}}
 */

/**
 * @typedef openUrlConfig
 * @property {string} [url=]
 * @property {string} [title=]
 * @property {boolean} [exclusiveView=],
 * @property {boolean} [darkenBackground=],
 * @property {boolean} [fullSize=],
 * @property {number} [width=]
 */

/**
 * @typedef loginStateResult
 * @property {loginState} loginState
 */

/**
 * @type {{
 *      refreshAccessToken(): Promise<undefined>,
 *      addGeoLocationListener(function): Promise<undefined>,
 *      appendUrlParameter(Object, boolean),
 *      addNfcListener(function): undefined,
 *      addOnActivateListener(function): boolean,
 *      floatingButtonPosition: {
 *          CENTER: number,
 *          LEFT: number,
 *          RIGHT: number
 *      },
 *      showOverlay(string, string): Promise,
 *      loginState: {
 *          FACEBOOK: number,
 *          T_WEB: number,
 *          CANCEL: number,
 *          ALREADY_LOGGED_IN: number
 *     },
 *     selectTapp(Object, string): Promise<undefined>,
 *     sendEventToTopFrame(*),
 *     createQRCode(string): Promise<string>,
 *     removeOnActivateListener(function): boolean,
 *     vibrate([number], number=),
 *     removeAccessTokenChangeListener(function): boolean,
 *     removeSubTapp(removeSubTappConfig): Promise<undefined>,
 *     mimeType: {
 *          IMAGE: number,
 *          VIDEO: number,
 *          DOCUMENT: number,
 *          AUDIO: number
 *     },
 *     getWebviewOptions(): Promise<unknown>,
 *     dynamicFontSize(),
 *     hideWaitCursor(): Promise<undefined>,
 *     uploadToCloud(*, *),
 *     disableDisplayTimeout(): Promise,
 *     urlType: {AR: number, WEB: number},
 *     setSubTapp(subTappConfig): Promise<undefined>,
 *     utils: {
 *          isJwt(*): boolean,
 *          getScaledImageUrl(string, int, int, boolean): string,
 *          isPermitted(*): boolean,
 *          ls: {
 *              removeAll(),
 *              getPrefix(),
 *              set(string, string): string,
 *              get(string),
 *              remove(string)
 *          },
 *          isPresent(*): boolean,
 *          isBlank(*): boolean,
 *          isUUID(*): boolean,
 *          colors: {
 *              getColorFromPalette(string): string,
 *              get(int, string): string,
 *              mix(string, string, int): string
 *          },
 *          translate: {
 *              init()
 *          },
 *          setLevel(*),
 *          isGUID(*): boolean,
 *          isBoolean(*): boolean,
 *          isPromise(*): boolean,
 *          isNumber(*): boolean,
 *          isDialogPermitted(): boolean,
 *          isUrl(*): boolean,
 *          isDate(*): boolean,
 *          isString(*): boolean,
 *          isUndefined(*): boolean,
 *          lang: {
 *              init(*),
 *              renderTextString(*),
 *              get(*),
 *              loadLib(*, *)
 *           },
 *          isObject(*): boolean,
 *          isFunction(*): boolean,
 *          getJwtPayload(string),
 *          isHex(*): boolean,
 *          isMacAddress(*): boolean,
 *          isFormElement(*): boolean,
 *          isFormData(*): boolean,
 *          resetEnvironment(*),
 *          isDefined(*): boolean,
 *          createTappUrl(*),
 *          isBLEAddress(*): boolean,
 *          isArray(*): boolean,
 *          isDeferred(*): boolean
 *      },
 *      enableDisplayTimeout(): Promise,
 *      removeNfcListener(function): boolean,
 *      invokeCall(*, *),
 *      cancelScanQrCode(): Promise,
 *      hideTitleImage(),
 *      hideFloatingButton(): Promise,
 *      logoutType: {
 *          FORCE: number,
 *          NORMAL: number
 *      },
 *      findPerson(string): Promise<findPersonResult>,
 *      findSite(string): Promise<findSiteResult>,
 *      navigateBack(): Promise<undefined>,
 *      openUrlInBrowser(string): Promise<Window>,
 *      setWebviewOptions(*),
 *      sharingApp: {
 *          FACEBOOK: number,
 *          GOOGLE_PLUS: number,
 *          MAIL: number,
 *          WHATSAPP: number,
 *          TWITTER: number,
 *          FACEBOOK_MESSENGER: number
 *      },
 *      deactivateAdminMode(): Promise,
 *      setHeight(setHeightConfig): Promise<undefined>,
 *      allowRefreshScroll(): Promise<undefined>,
 *      hideBackButton(),
 *      showWaitCursor(string, number): Promise<undefined>,
 *      updateCloudImage(),
 *      addAdminSwitchListener(function): boolean,
 *      openImage([string], number): Promise<undefined>,
 *      getUser(Object): Promise<userResult>,
 *      updateTapp(*),
 *      storage: {
 *          set(*, *, *, *),
 *          get(*, *),
 *          accessMode: {
 *              PUBLIC: number,
 *              PROTECTED: number,
 *              PRIVATE: number
 *          },
 *          remove(*, *)
 *      },
 *      login([string]=): Promise<loginStateResult>,
 *      logout(logoutType=): Promise<undefined>,
 *      addNetworkChangeListener(function): boolean,
 *      addAccessTokenChangeListener(function): boolean,
 *      removeAdminSwitchListener(function): boolean,
 *      animationType: {
 *          BOTTOM: number,
 *          DEFAULT: number
 *      },
 *      showFloatingButton(floatingButtonConfig, function),
 *      dialog: {
 *          buttonText: {
 *              NO: string,
 *              YES: string,
 *              CANCEL: string,
 *              OK: string
 *          },
 *          buttonType: {
 *              POSITIVE: number,
 *              CANCEL: number,
 *              NEGATIVE: number
 *          },
 *          dateType: {
 *              DATE: number,
 *              TIME: number,
 *              DATE_TIME: number
 *          },
 *          alert(*, *, *),
 *          selectType: {
 *              ICON: number,
 *              DEFAULT: number
 *          },
 *          inputType: {
 *              NUMBER: number,
 *              TEXTAREA: number,
 *              INPUT: number,
 *              PASSWORD: number,
 *              DEFAULT: number
 *          },
 *          fileType: {
 *              IMAGE: string,
 *              VIDEO: string,
 *              DOCUMENT: string[],
 *              AUDIO: string
 *          }
 *      },
 *      removeNetworkChangeListener(function): boolean,
 *      adminSwitchStatus: {
 *          ADMIN: number,
 *          USER: number
 *      },
 *      showSnackbar(*),
 *      ready: Promise<unknown>,
 *      scrollToY(number, number=),
 *      showTitleImage(),
 *      removeWindowMetricsListener(function): boolean,
 *      getGeoLocation(): Promise<geoLocation>,
 *      setScreenOrientation(number): Promise,
 *      share(sharingConfig): Promise,
 *      intercom: {
 *          sendMessageToUser(number, intercomConfig): Promise<Response>,
 *          sendMessageToGroup(number, intercomConfig): Promise<Response>,
 *          sendMessageToPage(intercomConfig): Promise<Response>
 *      },
 *      updateChaynsId(*),
 *      networkType: {
 *          CDMA_EVDO_A: number,
 *          CDMA_EVDO_B: number,
 *          EGDE: number,
 *          IDEN: number,
 *          HSUPA: number,
 *          HSPAP: number,
 *          NO_NETWORK: number,
 *          GPRS: number,
 *          EHRPD: number,
 *          UMTS: number,
 *          HSDPA: number,
 *          ETHERNET: number,
 *          LTE: number,
 *          NETWORK_TYPE_UNKNOWN: number,
 *          CDMA_1xRTT: number,
 *          HSPA: number,
 *          WIFI: number,
 *          CDMA_EVDO_0: number
 *      },
 *      event: {
 *          removePushListener(*),
 *          addPushListener(*)
 *      },
 *      addWindowMetricsListener(function): undefined,
 *      tappEvent: {
 *          ON_HIDE: number,
 *          ON_SHOW: number,
 *          ON_REFRESH: number
 *      },
 *      getWindowMetrics(): Promise<windowMetrics>,
 *      removeGeoLocationListener(function): boolean,
 *      uploadFile(*, *, *),
 *      orientation: {
 *          LANDSCAPE: number,
 *          PORTRAIT_REVERSE: number,
 *          PORTRAIT: number,
 *          LANDSCAPE_REVERSE: number,
 *          PORTRAIT_SENSOR: number,
 *          LANDSCAPE_SENSOR: number,
 *          DEFAULT: number
 *      },
 *      removeScrollListener(function): boolean,
 *      listeners: [null],
 *      hideOverlay(): Promise,
 *      activateAdminMode(): Promise,
 *      getGlobalData(),
 *      getNetworkStatus(),
 *      env: {
 *          appVersion: number,
 *          isChaynsWebMobile: boolean,
 *          language: string,
 *          isDesktop: boolean,
 *          isChaynsParent: boolean,
 *          apiVersion: number,
 *          isTablet: boolean,
 *          browser: {
 *              name: string,
 *              version: string,
 *              supportsWebP: boolean
 *          },
 *          isChaynsWebDesktop: boolean,
 *          isInFrame: boolean,
 *          isMobile: boolean,
 *          app: {
 *              flavor: undefined
 *          },
 *          isChaynsWeb: boolean,
 *          isMyChaynsApp: boolean,
 *          os: string,
 *          isApp: boolean,
 *          isBrowser: boolean,
 *          site: {
 *              locationPersonId: string,
 *              color: string,
 *              headlineFontId: number,
 *              colorMode: number,
 *              language: string,
 *              title: string,
 *              version: string,
 *              url: string,
 *              facebookPageId: null,
 *              environment: string,
 *              disposition: {
 *                  contentWide: boolean,
 *                  coverDetached: boolean,
 *                  barOnTop: boolean,
 *                  coverWide: boolean,
 *                  docked: boolean,
 *                  barWide: boolean
 *              },
 *              locationId: number,
 *              tapps: [
 *                  {
 *                      customUrl: string,
 *                      internalName: string,
 *                      isSubTapp: boolean,
 *                      showName: string,
 *                      sortId: number,
 *                      iconType: number,
 *                      isHiddenFromMenu: boolean,
 *                      icon: string,
 *                      id: number
 *                  }
 *              ],
 *              domain: string,
 *              id: string,
 *              tapp: {
 *                  customUrl: string,
 *                  internalName: string,
 *                  isSubTapp: boolean,
 *                  showName: string,
 *                  sortId: number,
 *                  iconType: number,
 *                  isHiddenFromMenu: boolean,
 *                  icon: string,
 *                  id: number,
 *                  userGroupIds: [number]
 *              },
 *              font: number
 *          },
 *          isWP: boolean,
 *          isInFacebookFrame: boolean,
 *          isWidget: boolean,
 *          isAndroid: boolean,
 *          parameters: {},
 *          user: {
 *              firstName: string,
 *              lastName: string,
 *              tobitAccessToken: string,
 *              name: string,
 *              adminMode: boolean,
 *              groups: [
 *                  {
 *                      id: number,
 *                      isActive: boolean
 *                  }
 *              ],
 *              personId: string,
 *              id: number,
 *              isAuthenticated: boolean,
 *              isAdmin: boolean
 *          },
 *          device: {
 *              uid: undefined,
 *              dfaceVersion: undefined,
 *              minLogLevel: undefined,
 *              systemName: undefined,
 *              deviceAccessToken: undefined,
 *              languageId: undefined,
 *              imei: undefined,
 *              model: undefined,
 *              fontScale: undefined,
 *              version: undefined
 *          },
 *          debugMode: boolean,
 *          isIOS: boolean,
 *          _parameters: {}
 *      },
 *      getLastPushNotification(): Promise<unknown>,
 *      openUrl(openUrlConfig): Promise,
 *      disallowRefreshScroll(): Promise<undefined>,
 *      showBackButton(*),
 *      closeUrl(): Promise<undefined>,
 *      cameryType: {AUTO: number, BACK: number, FRONT: number},
 *      openVideo(string): Promise<undefined>,
 *      getAvailableSharingServices(): Promise<sharingServicesResult>,
 *      addScrollListener(function): boolean,
 *      scanQRCode(cameraType, number): Promise,
 *      register(*)}}
 */
const chayns = {
    /**
     * @returns {Promise}
     */
    activateAdminMode() {},
    /**
     * @callback accessTokenCb
     */
    /**
     * @param {accessTokenCb} callback
     * @returns {boolean} success
     */
    addAccessTokenChangeListener(callback) {},
    /**
     * @callback adminSwitchCb
     * @param {Object} result
     * @param {number|0|1} result.mode
     */
    /**
     * @param {adminSwitchCb} callback
     * @returns {boolean} success
     */
    addAdminSwitchListener(callback) {},
    /**
     * @callback geoLocationCb
     * @param {Object} geoLocation
     * @param {number} latitude
     * @param {number} longitude
     * @param {number} speed
     * @param {number} accuracy
     */
    /**
     * @param {geoLocationCb} callback
     * @returns {undefined}
     */
    addGeoLocationListener(callback) {},
    /**
     * @callback networkChangeCb
     * @param status
     */
    /**
     * @param callback
     * @returns {boolean} success
     */
    addNetworkChangeListener(callback) {},
    /**
     * @callback nfcListenerCb
     * @param param
     */
    /**
     * @returns {undefined}
     * @param {nfcListenerCb} callback
     */
    addNfcListener(callback) {},
    /**
     * @callback onActivateCb
     */
    /**
     * @returns {boolean} success
     * @param {onActivateCb} callback
     */
    addOnActivateListener(callback) {},
    /**
     * @callback scrollCb
     */
    /**
     * @returns {boolean} success
     * @param {scrollCb} callback
     */
    addScrollListener(callback) {},
    /**
     * @callback windowMetricsCb
     * @param {Object} windowMetrics
     * @param {number} windowMetrics.pageYOffset
     * @param {number} windowMetrics.windowHeight
     * @param {number} windowMetrics.frameX
     * @param {number} windowMetrics.scrollTop
     * @param {number} windowMetrics.frameY
     * @param {number} windowMetrics.height
     */
    /**
     * @returns {boolean} success
     * @param {windowMetricsCb} callback
     */
    addWindowMetricsListener(callback) {},
    /**
     * @returns {Promise<undefined>}
     */
    allowRefreshScroll() {},
    /**
     * @returns {Promise<undefined>}
     */
    disallowRefreshScroll() {},
    /**
     * @returns {Promise<undefined>}
     * @param {Object} parameters
     * @param {boolean} overwrite
     */
    appendUrlParameter(parameters, overwrite) {},
    /**
     * @returns {Promise<undefined>}
     */
    closeUrl() {},
    /**
     * @returns {Promise}
     */
    cancelScanQrCode() {},
    /**
     * @returns {Promise<string>} codeUrl
     * @param {string} url
     */
    createQRCode(url) {},
    /**
     * @returns {Promise}
     */
    deactivateAdminMode() {},
    /**
     * @returns {Promise}
     */
    disableDisplayTimeout() {},
    dynamicFontSize() {},
    /**
     * @returns {Promise}
     */
    enableDisplayTimeout() {},
    /**
     * @returns {Promise<findPersonResult>} person
     * @param {string} name
     */
    findPerson(name) {},
    /**
     * @returns {Promise<findSiteResult>} site
     * @param {string} name
     */
    findSite(name) {},
    /**
     * @returns {Promise<sharingServicesResult>}
     */
    getAvailableSharingServices() {},
    /**
     * @returns {Promise<geoLocation>}
     */
    getGeoLocation() {},
    /**
     * @returns {Promise<Object>}
     */
    getGlobalData() {},
    /**
     * @returns {Promise<unknown>}
     */
    getLastPushNotification() {},
    /**
     * @returns {Promise<unknown>}
     */
    getNetworkStatus() {},
    /**
     * @returns {Promise<userResult>}
     * @param {Object} config
     * @param {string} [config.AccessToken=]
     * @param {number} [config.FBID=]
     * @param {number} [config.UserID=]
     * @param {string} [config.PersonID=]
     */
    getUser(config) {},
    getWebviewOptions() {},
    /**
     * @returns {Promise<windowMetrics>}
     */
    getWindowMetrics() {},
    /**
     * @returns {Promise}
     */
    hideBackButton() {},
    /**
     * @returns {Promise}
     */
    hideFloatingButton() {},
    /**
     * @returns {Promise}
     */
    hideOverlay() {},
    /**
     * @returns {Promise}
     */
    hideTitleImage() {},
    /**
     * @returns {Promise}
     */
    hideWaitCursor() {},
    /**
     * @returns {Promise}
     * @param {Object} config - s.chaynsCalls docs
     */
    invokeCall(config) {},
    /**
     * @returns {Promise<loginStateResult>}
     * @param {string} parameters
     */
    login(parameters) {},
    /**
     * @returns {Promise<undefined>}
     * @param {logoutType|0|1} [type=0]
     */
    logout(type) {},
    /**
     * @returns {Promise<undefined>}
     */
    navigateBack() {},
    /**
     * @returns {Promise<undefined>}
     * @param {string|string[]} urls
     * @param {number} [start=0]
     */
    openImage(urls, start) {},
    /**
     * @returns {Promise}
     * @param {Object} config
     * @param {string} config.url
     * @param {string} [config.title=]
     * @param {boolean} [config.exclusiveView=],
     * @param {boolean} [config.darkenBackground=],
     * @param {boolean} [config.fullSize=],
     * @param {number} [config.width=]
     */
    openUrl(config) {},
    /**
     * @returns {Promise<Window>} window
     * @param {string} url
     */
    openUrlInBrowser(url) {},
    /**
     * @return {Promise}
     * @param {string} url
     */
    openVideo(url) {},
    /**
     * @returns {Promise}
     */
    refreshAccessToken() {},
    /**
     * @returns {*}
     * @param {Object} config
     */
    register(config) {},
    /**
     * @returns {boolean} success
     * @param {accessTokenCb} callback
     */
    removeAccessTokenChangeListener(callback) {},
    /**
     * @returns {boolean} success
     * @param {adminSwitchCb} callback
     */
    removeAdminSwitchListener(callback) {},
    /**
     * @returns {boolean} success
     * @param {geoLocationCb} callback
     */
    removeGeoLocationListener(callback) {},
    /**
     * @returns {boolean} success
     * @param {networkChangeCb} callback
     */
    removeNetworkChangeListener(callback) {},
    /**
     * @returns {boolean} success
     * @param {nfcListenerCb} callback
     */
    removeNfcListener(callback) {},
    /**
     * @returns {boolean} success
     * @param {onActivateCb} callback
     */
    removeOnActivateListener(callback) {},
    /**
     * @returns {boolean} success
     * @param {scrollCb} callback
     */
    removeScrollListener(callback) {},
    /**
     * @returns {boolean} success
     * @param {windowMetricsCb} callback
     */
    removeWindowMetricsListener(callback) {},
    /**
     * @returns {Promise<undefined>}
     * @param {Object} config
     * @param {number} config.tappID
     * @param {boolean} config.close
     * @param {boolean} config.remove
     */
    removeSubTapp(config) {},
    /**
     * @returns {Promise}
     * @param {cameraType} cameraType
     * @param {number} timeout
     */
    scanQRCode(cameraType, timeout) {},
    /**
     * @returns {*}
     * @param {number} position
     * @param {number} duration
     */
    scrollToY(position, duration) {},
    /**
     * @param {Object} tapp
     * @param {number} [tapp.tappId=]
     * @param {string} [tapp.showName=]
     * @param {string} [tapp.internalName=]
     * @param {string} [tapp.siteId=]
     * @param {string} [parameter=]
     */
    selectTapp(tapp, parameter) {},
    sendEventToTopFrame(param) {},
    /**
     * @returns {Promise<undefined>}
     * @param {Object} config
     * @param {number} config.height
     * @param {boolean} config.growOnly
     * @param {boolean} config.full
     * @param {boolean} config.fullViewport
     * @param {boolean} config.forceHeight
     */
    setHeight(config) {},
    /**
     * @returns {Promise}
     * @param {number|0|1|2} orientation
     */
    setScreenOrientation(orientation) {},
    /**
     * @returns {Promise<undefined>}
     * @param {Object} config
     * @param {number} config.tappID
     * @param {string} config.name,
     * @param {string} config.color
     * @param {string} config.colorText
     * @param {number} config.sortID
     * @param {string} config.icon
     * @param {function} config.callbackURL
     * @param {string} config.url
     * @param {string} config.buttonName
     * @param {boolean} config.isExclusiveView
     * @param {boolean} config.replaceParent
     * @param {boolean} config.boldText
     */
    setSubTapp(config) {},
    setWebviewOptions(param) {},
    /**
     * @returns {Promise}
     * @param {Object} config
     * @param {string} config.title
     * @param {string} config.text
     * @param {string} config.imageUrl
     * @param {number} config.sharingApp
     * @param {string} config.sharingAndroidApp
     */
    share(config) {},
    showBackButton(param) {},
    /**
     * @returns {Promise}
     * @param {Object} config
     * @param {function} config.callback
     * @param {string} config.text
     * @param {string} config.color
     * @param {string} config.colorText
     * @param {string} config.icon
     * @param {number} config.position
     * @param onClick
     */
    showFloatingButton(config, onClick) {},
    /**
     * @returns {Promise}
     * @param {string} color
     * @param {string} transition
     */
    showOverlay(color, transition) {},
    showSnackbar(param) {},
    /**
     * @returns {Promise}
     */
    showTitleImage() {},
    /**
     * @returns {Promise}
     * @param {string} text
     * @param {number} textTimeout
     */
    showWaitCursor(text, textTimeout) {},
    updateChaynsId(param) {},
    updateTapp(param) {},
    updateCloudImage() {},
    /**
     * @returns {Promise<*>}
     * @param {File} file
     * @param {*} param1
     * @param {*} param2
     */
    uploadFile(file, param1, param2) {},
    /**
     * @returns {Promise<*>}
     * @param {File} file
     * @param {*} param
     */
    uploadToCloud(file, param) {},
    /**
     * @returns
     * @param {number[]} pattern
     * @param {number} iOSFeedbackVibration
     */
    vibrate(pattern, iOSFeedbackVibration) {},
    ready: new Promise(),
    env: {
        parameters: {},
        _parameters: {},
        browser: { name: '', version: '', supportsWebP: false },
        language: '',
        site: {
            id: '',
            locationId: 0,
            locationPersonId: '',
            title: '',
            language: '',
            tapps: [
                {
                    id: 0,
                    showName: '',
                    internalName: '',
                    isSubTapp: false,
                    sortId: -0,
                    customUrl: '',
                    isHiddenFromMenu: false,
                    icon: '',
                    iconType: 0
                }, {
                    id: -7,
                    showName: '',
                    internalName: '',
                    isSubTapp: false,
                    sortId: -0,
                    customUrl: '',
                    isHiddenFromMenu: false,
                    icon: '',
                    iconType: 0
                }
            ],
            facebookPageId: null,
            color: '#000000',
            colorMode: 1,
            version: '2.186',
            domain: '',
            font: 1,
            environment: '',
            tapp: {
                id: 0,
                showName: '',
                internalName: '',
                isSubTapp: false,
                sortId: 0,
                userGroupIds: [1],
                customUrl: '',
                isHiddenFromMenu: false,
                icon: '',
                iconType: 0
            },
            disposition: {
                coverWide: false,
                barWide: true,
                docked: true,
                barOnTop: true,
                contentWide: false,
                coverDetached: false
            },
            headlineFontId: 0,
            url: ''
        },
        user: {
            name: '',
            firstName: '',
            lastName: '',
            id: 2062159,
            personId: '',
            tobitAccessToken:
                '',
            groups: [
                { id: 1, isActive: false }, { id: 0, isActive: false }, { id: 0, isActive: false }, {
                    id: 0,
                    isActive: false
                }
            ],
            isAuthenticated: true,
            adminMode: false,
            isAdmin: true
        },
        app: { flavor: undefined },
        device: {
            deviceAccessToken: undefined,
            dfaceVersion: undefined,
            fontScale: undefined,
            imei: undefined,
            languageId: undefined,
            minLogLevel: undefined,
            model: undefined,
            systemName: undefined,
            uid: undefined,
            version: undefined
        },
        isIOS: false,
        isAndroid: false,
        isWP: false,
        isMobile: false,
        isTablet: false,
        isApp: false,
        isBrowser: true,
        isDesktop: true,
        os:
            'noOS',
        isChaynsWebMobile: false,
        isChaynsWebDesktop: true,
        isChaynsWeb: true,
        isChaynsParent: true,
        isMyChaynsApp:
            false,
        isWidget: false,
        isInFrame: false,
        isInFacebookFrame: false,
        appVersion: 2.186,
        debugMode: false,
        apiVersion:
            4000
    },
    utils: {
        createTappUrl(param) {},
        getJwtPayload(param) {},
        getScaledImageUrl(url, height, width, preventWebP) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isArray(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isBLEAddress(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isBlank(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isBoolean(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isDate(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isDeferred(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isDefined(param) {},
        /**
         * @returns {boolean}
         */
        isDialogPermitted() {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isFormData(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isFormElement(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isFunction(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isGUID(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isHex(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isJwt(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isMacAddress(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isNumber(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isObject(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isPermitted(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isPresent(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isPromise(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isString(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isUUID(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isUndefined(param) {},
        /**
         * @returns {boolean}
         * @param {*} param
         */
        isUrl(param) {},
        resetEnvironment(param) {},
        setLevel(param) {},
        colors: {
            /**
             * @returns {string} color
             * @param {number} saturation
             * @param {string} hex
             */
            get(saturation, hex) {},
            /**
             * @returns {string} color
             * @param {string} name
             */
            getColorFromPalette(name) {},
            /**
             * @returns {string} color
             * @param {string} hex1
             * @param {string} hex2
             * @param {string} saturation
             */
            mix(hex1, hex2, saturation) {},
        },
        ls: {
            /**
             * @returns {string} value
             * @param {string} key
             */
            get(key) {},
            getPrefix() {},
            /**
             * @param {string} key
             */
            remove(key) {},
            removeAll() {},
            /**
             * @param {string} key
             * @param {string} value
             */
            set(key, value) {}
        },
        lang: {
            get(param) {},
            init(param) {},
            loadLib(p1, p2) {},
            renderTextString(param) {}
        },
        translate: {
            init() {}
        }
    },
    dialog: {
        alert(title, message, buttons) {},
        buttonText: {
            YES: 'Yes',
            NO: 'No',
            OK:
                'OK',
            CANCEL: 'Cancel'
        },
        buttonType: { CANCEL: -1, NEGATIVE: 0, POSITIVE: 1 },
        selectType: { DEFAULT: 0, ICON: 1 },
        dateType: { DATE: 1, TIME: 2, DATE_TIME: 3 },
        inputType: {
            DEFAULT: 0, PASSWORD: 1, TEXTAREA: 2, INPUT: 3, NUMBER: 4
        },
        fileType: {
            IMAGE: 'image',
            VIDEO: 'video',
            AUDIO: 'audio',
            DOCUMENT: [
                'application/x-latex', 'application/x-tex', 'text/', 'application/json', 'application/pdf',
                'application/msword', 'application/msexcel', 'application/mspowerpoint', 'application/vnd.ms-word',
                'application/vnd.ms-excel', 'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument', 'application/vnd.oasis.opendocument'
            ]
        }
    },
    urlType: { WEB: 0, AR: 1 },
    animationType: { DEFAULT: 0, BOTTOM: 1 },
    cameryType: { AUTO: 0, BACK: 1, FRONT: 2 },
    logoutType: { NORMAL: 0, FORCE: 1 },
    loginState: {
        FACEBOOK: 0, T_WEB: 1, CANCEL: 2, ALREADY_LOGGED_IN: 3
    },
    tappEvent: { ON_SHOW: 0, ON_HIDE: 1, ON_REFRESH: 2 },
    listeners: [null],
    floatingButtonPosition: { RIGHT: 0, CENTER: 1, LEFT: 2 },
    storage: {
        get(key, param) {},
        remove(key, param) {},
        set(key, param1, param2, param3) {},
        accessMode: { PUBLIC: 0, PROTECTED: 1, PRIVATE: 2 }
    },
    networkType: {
        NO_NETWORK: 0,
        NETWORK_TYPE_UNKNOWN: 1,
        IDEN: 2,
        GPRS: 3,
        EGDE: 4,
        CDMA_1xRTT: 5,
        CDMA_EVDO_0: 6,
        CDMA_EVDO_A: 7,
        CDMA_EVDO_B: 8,
        UMTS: 9,
        EHRPD: 10,
        HSDPA: 11,
        HSPA: 12,
        HSPAP: 13,
        HSUPA: 14,
        LTE: 15,
        WIFI: 16,
        ETHERNET: 17
    },
    sharingApp: {
        MAIL: 0, WHATSAPP: 1, FACEBOOK: 2, FACEBOOK_MESSENGER: 3, GOOGLE_PLUS: 4, TWITTER: 5
    },
    adminSwitchStatus: { ADMIN: 1, USER: 0 },
    orientation: {
        DEFAULT: 0,
        PORTRAIT: 1,
        LANDSCAPE: 2,
        PORTRAIT_SENSOR: 3,
        LANDSCAPE_SENSOR: 4,
        PORTRAIT_REVERSE: 5,
        LANDSCAPE_REVERSE: 6
    },
    mimeType: {
        DOCUMENT: 0, AUDIO: 1, IMAGE: 2, VIDEO: 3
    },
    event: {
        addPushListener(callback) {},
        removePushListener(callback) {}
    },
    intercom: {
        /**
         * @returns {Promise<Response>}
         * @param {number} groupId
         * @param {Object} config
         * @param {string} config.text
         */
        sendMessageToGroup(groupId, config) {},
        /**
         * @returns {Promise<Response>}
         * @param {Object} config
         * @param {string} config.text
         */
        sendMessageToPage(config) {},
        /**
         * @returns {Promise<Response>}
         * @param {number} userId
         * @param {Object} config
         * @param {string} config.text
         */
        sendMessageToUser(userId, config) {}
    },
};
