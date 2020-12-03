/* eslint-disable no-proto */
import extendedPrototypes from './extendedPrototypes';

/**
 * @template {Object|Array.<*>|string|number|function|Date|Promise|boolean} T
 * @param {T} element
 * @param {boolean} mutate - whether to mutate the original value or just return a new value
 * @returns {T|extendedPrototypes.Array|extendedPrototypes.Date|extendedPrototypes.Number|extendedPrototypes.String|extendedPrototypes.Object|extendedPrototypes.Promise}
 */
const extend = (element, mutate = false) => {
    if (element === null || element === undefined) {
        return element;
    }
    if (chayns.utils.isObject(element)) {
        const proto = extendedPrototypes.Object;
        if (mutate) {
            // eslint-disable-next-line no-param-reassign
            element.__proto__ = proto;
            return element;
        }
        const resultElement = { ...element };
        resultElement.__proto__ = proto;
        return resultElement;
    }
    if (chayns.utils.isArray(element)) {
        const proto = extendedPrototypes.Array;
        if (mutate) {
            // eslint-disable-next-line no-param-reassign
            element.__proto__ = proto;
            return element;
        }
        const result = [...element];
        result.__proto__ = proto;
        return result;
    }
    if (chayns.utils.isString(element)) {
        const proto = extendedPrototypes.String;
        // eslint-disable-next-line no-new-wrappers
        const result = new String(element);
        result.__proto__ = proto;
        return result;
    }
    if (chayns.utils.isNumber(element)) {
        const proto = extendedPrototypes.Number;
        // eslint-disable-next-line no-new-wrappers
        const result = new Number(element);
        result.__proto__ = proto;
        return result;
    }
    if (chayns.utils.isFunction(element)) {
        return element;
    }
    if (chayns.utils.isBoolean(element)) {
        return element;
    }
    if (chayns.utils.isDate(element)) {
        const proto = extendedPrototypes.Date;
        if (mutate) {
            // eslint-disable-next-line no-param-reassign
            element.__proto__ = proto;
            return element;
        }
        const result = new Date(element);
        result.__proto__ = proto;
        return result;
    }
    if (chayns.utils.isPromise(element)) {
        return new extendedPrototypes.Promise(element);
    }
    // eslint-disable-next-line no-console
    console.warn('[Types] Element is not of a valid extendable type');
    return element;
};

export default extend;
