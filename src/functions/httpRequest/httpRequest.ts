import HttpClient from './HttpClient';
import RequestError from './RequestError';
import { ResponseType } from './ResponseType';
import LogLevel from './LogLevel';
import HttpMethod from './HttpMethod';
import setRequestDefaults, { defaultConfig } from './setRequestDefaults';
import { HttpRequestConfig, HttpRequestOptions } from './types';

/**
 * Extensive and highly customizable fetch helper. Consult documentation for usage.
 * @param address
 * @param config
 * @param processName
 * @param options
 */
export function httpRequest(
    // full request address. URLs should be defined as functions or constants in a separate file
    address: string,
    // fetch config
    config: HttpRequestConfig = {},
    // processName for logs
    processName = 'httpRequest',
    // options for this helper
    options: HttpRequestOptions = {},
): Promise<any> {
    return new HttpClient(defaultConfig).fetch(address, config, processName, options);
}

const request = {
    fetch: httpRequest,
    error: RequestError,
    responseType: ResponseType,
    logLevel: LogLevel,
    method: HttpMethod,
    defaults: setRequestDefaults,
};

export default request;
