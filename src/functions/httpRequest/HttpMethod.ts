export enum HttpMethodEnum {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Patch = 'PATCH',
    Delete = 'DELETE',
}

/**
 * An enum for HTTP methods
 */
const HttpMethod: {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Patch: 'PATCH',
    Delete: 'DELETE',
} = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Patch: 'PATCH',
    Delete: 'DELETE',
}

export type HttpMethodType = typeof HttpMethod[keyof typeof HttpMethod] | string;

export default HttpMethod;
