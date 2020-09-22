import LogLevel from './LogLevel';
import ResponseType from './ResponseType';

/**
 * @type {{default: {options: {logConfig: {'401': string, '[\\d]+': string, '[1-3][\\d]{2}': string}, responseType:
 *     string, additionalLogData: {}, statusHandlers: {}, onProgress: null, stringifyBody: boolean, autoRefreshToken:
 *     boolean, showDialogs: boolean, useFetchApi: boolean, addHashToUrl: boolean, ignoreErrors: boolean}, config: {}},
 *     noErrors: {options: {logConfig: {'401': string, '2[\\d]{2}': string, '3[\\d]{2}': string, '[\\d]+': string,
 *     '.*': string}, responseType: string, additionalLogData: {}, statusHandlers: {'204': string, '2[\\d]{2}': string,
 *     '.*': string}, onProgress: null, stringifyBody: boolean, autoRefreshToken: boolean, showDialogs: boolean,
 *     useFetchApi: boolean, addHashToUrl: boolean, ignoreErrors: boolean}, config: {cache: string}}, strict: {options:
 *     {logConfig: {'200': string, '[\\d]+': string, '.*': string}, responseType: string, statusHandlers: {'(?!200)':
 *     string}, additionalLogData: {}, onProgress: null, stringifyBody: boolean, autoRefreshToken: boolean,
 *     showDialogs: boolean, useFetchApi: boolean, addHashToUrl: boolean, ignoreErrors: boolean}, config: {cache:
 *     string}}, extended: {options: {logConfig: {'401': string, '2[\\d]{2}': string, '3[\\d]{2}': string, '[\\d]+':
 *     string, '.*': string}, responseType: string, additionalLogData: {}, statusHandlers: {'204': string, '3[\\d]{2}':
 *     string}, onProgress: null, stringifyBody: boolean, autoRefreshToken: boolean, showDialogs: boolean, useFetchApi:
 *     boolean, addHashToUrl: boolean, ignoreErrors: boolean}, config: {headers: {CacheControl: string, Pragma:
 *     string}, cache: string}}}}
 */
const requestPresets = {
    // the default config
    default: {
        config: {},
        options: {
            responseType: ResponseType.Json,
            logConfig: {
                '[1-3][\\d]{2}': LogLevel.info,
                401: LogLevel.warning,
                '[\\d]+': LogLevel.error
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
                '2[\\d]{2}': LogLevel.info,
                '3[\\d]{2}': LogLevel.warning,
                401: LogLevel.warning,
                '[\\d]+': LogLevel.error,
                '.*': LogLevel.critical
            },
            ignoreErrors: false,
            useFetchApi: true,
            stringifyBody: true,
            additionalLogData: {},
            autoRefreshToken: true,
            statusHandlers: {
                204: ResponseType.Response,
                '3[\\d]{2}': ResponseType.Response
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
                '[\\d]+': LogLevel.error,
                '.*': LogLevel.critical
            },
            statusHandlers: {
                '(?!200)': ResponseType.Error
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
                '2[\\d]{2}': LogLevel.info,
                '3[\\d]{2}': LogLevel.warning,
                401: LogLevel.warning,
                '[\\d]+': LogLevel.error,
                '.*': LogLevel.critical
            },
            ignoreErrors: true,
            useFetchApi: true,
            stringifyBody: true,
            additionalLogData: {},
            autoRefreshToken: true,
            statusHandlers: {
                204: ResponseType.Response,
                '2[\\d]{2}': ResponseType.Object,
                '.*': ResponseType.Response
            },
            onProgress: null,
            addHashToUrl: false,
            showDialogs: false
        }
    }
};

export default requestPresets;
