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
 * Set default for request.fetch. Consult httpRequest.md for usage.
 */
export default function setRequestDefaults(address: string, config: HttpRequestConfig, options: HttpRequestOptions) {
    defaultConfig.address = address || '';
    defaultConfig.config = config || {};
    defaultConfig.options = options || {};
}
