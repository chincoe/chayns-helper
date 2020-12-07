import {HttpRequestConfig, HttpRequestOptions} from "./httpRequest";

export const defaultConfig : {
    options: HttpRequestOptions,
    address: string,
    config: HttpRequestConfig
} = {
    options: {},
    address: '',
    config: {}
};

/**
 * Set defaults for httpRequest
 */
export default function setRequestDefaults(address: string, config: HttpRequestConfig, options: HttpRequestOptions) {
    defaultConfig.address = address || '';
    defaultConfig.config = config || {};
    defaultConfig.options = options || {};
}
