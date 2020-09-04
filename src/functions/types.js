/* eslint-disable no-proto,no-underscore-dangle */
import { fnsFormat, time } from './timeHelper';

const isArray = (arr) => (Array.isArray(arr));
const isObject = (obj) => (Object.prototype.toString.call(obj) === '[object Object]');
const isBasedOnObject = (obj) => (obj !== null && typeof (obj) === 'object');
const isFunction = (func) => (typeof (func) === 'function');
const isBoolean = (func) => (typeof (func) === 'boolean');
const isString = (string) => (typeof (string) === 'string');
const isDate = (date) => (Object.prototype.toString.call(date) === '[object Date]');
// eslint-disable-next-line no-restricted-globals
const isNumber = (num) => (typeof (num) === 'number' && !isNaN(num));
// eslint-disable-next-line no-restricted-globals
const isCleanNumber = (num) => (typeof (num) === 'number' && num !== Infinity && !(isNaN(num)));
// eslint-disable-next-line no-restricted-globals
const isInteger = (int) => (typeof (int) === 'number' && int !== Infinity && !(isNaN(int)) && int % 1 === 0);
// eslint-disable-next-line no-prototype-builtins
const isPromise = (prom) => Promise.prototype.isPrototypeOf(prom);

/**
 * @type {{date: string, number: string, string: string, null: string, array: string, function: string, object: string,
 *     undefined: string}}
 */
const typeStrings = {
    array: '[object Array]',
    object: '[object Object]',
    function: '[object Function]',
    string: '[object String]',
    number: '[object Number]',
    date: '[object Date]',
    undefined: '[object Undefined]',
    null: '[object Null]'
};

/**
 * @typedef selectorCb
 * @param {*} param
 * @returns {boolean}
 */

/**
 * Array.firstOrDefault
 * @param {*[]} arr
 * @param {selectorCb} callback
 * @return {null|*}
 */
const safeFirst = (arr, callback = () => true) => {
    if (!isArray(arr)) return null;
    const relevantArray = (arr || []);
    if (!types.isFunction(callback)) return relevantArray[0] || null;
    return relevantArray.filter(callback)[0] || null;
};

/**
 * Array.distinct(selector)
 * @param {*[]} arr
 * @param {function(*)} selector
 * @returns {null|*[]}
 */
const distinct = (arr, selector) => {
    if (!isArray(arr) || !isFunction(selector)) return null;
    return arr.reduce((total, current) => {
        const idx = total.findIndex((t) => selector(t) === selector(current));
        if (idx > 0) {
            const result = [...total];
            result[idx] = current;
            return result;
        }
        return [...total, current];
    }, []);
};

/**
 * get Type string. More different types than typeof
 * @param {*} val
 * @return {string}
 */
const getType = (val) => ({}.toString.call(val))
    .replace('[object ', '')
    .replace(']', '')
    .toLowerCase();

/**
 * length of array or string, count of number digits or count of object keys
 * @param {*[]|Object|string|number} val
 * @return {number}
 */
const length = (val) => {
    if (!isArray(val) && !isString(val) && !isObject(val) && !isNumber(val)) return 0;
    const type = getType(val);
    switch (type) {
        case 'object':
            return (Object.keys(val) || []).length;
        case 'string':
            return (val || '').length;
        case 'array':
            return (val || []).length;
        case 'number':
            return (`${val}` || '').length;
        default:
            return 0;
    }
};

/**
 * @param {*} value
 * @return {boolean}
 */
const isNullOrEmpty = (value) => {
    const type = getType(value);
    switch (type) {
        case 'undefined':
        case 'null':
            return true;
        case 'string':
            return /^ *$/i.test(value);
        case 'object':
            return length(Object.keys(value)) === 0;
        case 'array':
            return length(value) === 0;
        case 'number':
        case 'boolean':
        case 'function':
            return false;
        default:
            return false;
    }
};

/**
 * @param {*} value
 * @param {*} replacement
 * @return {*}
 */
const replaceEmpty = (value, replacement) => (isNullOrEmpty(value) ? replacement : value);

/**
 * Get key from object if it exists, return null otherwise
 * @param {Object} object
 * @param {string} key
 * @return {null|*}
 */
const safeValue = (object, key) => {
    if (!isObject || !Object.hasOwnProperty.call(object, key)) return null;
    return object[key];
};

/**
 * @param {Object} obj
 * @param {string }key
 * @return {boolean}
 */
const hasKey = (obj, key) => Object.hasOwnProperty.call(obj, key);

/**
 * @callback forEachKeyCallback
 * @param {string} key
 * @param {*} [value]
 * @param {number} index
 * @param {Object} sourceObject
 */
/**
 *
 * @param {Object} obj
 * @param {forEachKeyCallback} callback
 */
const forEachKey = (obj, callback) => {
    if (!isObject(obj) || !isFunction(callback)) return;
    const keys = Object.keys(obj);
    for (let i = 0; i < length(keys); i += 1) {
        callback(keys[i], obj[keys[i]], i, obj);
    }
};

/**
 * Map object to another object
 * @param {Object} obj
 * @param {forEachKeyCallback} callback
 * @return {Object}
 */
const mapObject = (obj, callback) => {
    if (!isObject(obj) || !isFunction(callback)) return {};
    const keys = Object.keys(obj);
    const newObj = { ...obj };
    for (let i = 0; i < length(keys); i += 1) {
        newObj[keys[i]] = callback(keys[i], obj[keys[i]], i, obj);
    }
    return newObj;
};

/**
 * Map object to an array
 * @param {Object} obj
 * @param {forEachKeyCallback} callback
 * @return {[]|*[]}
 */
const mapObjectToArray = (obj, callback) => {
    if (!isObject(obj) || !isFunction(callback)) return [];
    const keys = Object.keys(obj);
    const arr = [];
    for (let i = 0; i < length(keys); i += 1) {
        arr[i] = callback(keys[i], obj[keys[i]], i, obj);
    }
    return arr;
};

/**
 * @callback reduceCallback
 * @param {Object} resultObject
 * @param {string} key
 * @param {*} [value]
 * @param {number} index
 * @param {Object} sourceObject
 */
/**
 * like Array.reduce but for objects
 * @param {Object} obj
 * @param {reduceCallback} callback
 * @param {Object} [initialValue={}]
 * @return {{}}
 */
const reduceObject = (obj, callback, initialValue = {}) => {
    if (!isObject(obj) || !isFunction(callback)) return {};
    const keys = Object.keys(obj);
    let newObj = initialValue;
    for (let i = 0; i < length(keys); i += 1) {
        newObj = callback(newObj, keys[i], obj[keys[i]], i, obj);
    }
    return newObj;
};

/**
 * Replace up to maxReplacements occurrences of a string
 * @param {string} string
 * @param {string|RegExp} search
 * @param {string|function} replacement
 * @param {number} maxReplacements
 * @return {string}
 */
const replaceAll = (string, search, replacement, maxReplacements = 50) => {
    let i = 0;
    let newString = string;
    while (i < maxReplacements) {
        const tempString = newString.replace(search, replacement);
        if (tempString === newString) {
            return tempString;
        }
        newString = tempString;
        i++;
    }
    return newString;
};

/**
 * @param {Object|Array.<*>|string|number|function|Date|Promise|boolean} element
 * @param {boolean} mutate - whether to mutate the original value or just return a new value
 * @returns {String|string|null|*|boolean|{}|*[]|{__proto__: {reduce(forEachKeyCallback, *): (Array|Object|*),
 *     isPrototypeOf(v: Object): boolean, propertyIsEnumerable(v: PropertyKey): boolean, isNullOrEmpty(): boolean,
 *     forEach(forEachKeyCallback): undefined, valueOf(): Object, length(): number, constructor: Function,
 *     tryGet(string): (null|*), hasOwnProperty(v: PropertyKey): boolean, mapToArray(forEachKeyCallback): *[],
 *     toArray(): Array<{key: string, value: *}>, _value(): {}, toString(): string, map(forEachKeyCallback):
 *     Object<string, *>, _revert(): void, toLocaleString(): string}}|Date|number|undefined|Number}
 */
export const extend = (element, mutate = false) => {
    if (element === null || element === undefined) {
        return element;
    }
    if (isObject(element)) {
        const proto = {
            /**
             * @returns {Array.<{key: string, value:*}>}
             */
            toArray() {
                return mapObjectToArray(this, (key, value) => ({ key, value }));
            },
            /**
             * @returns {boolean}
             */
            isNullOrEmpty() {
                return isNullOrEmpty(this);
            },
            /**
             * @param {string} key
             * @returns {null|*}
             */
            tryGet(key) {
                return safeValue(this, key);
            },
            /**
             * @param {forEachKeyCallback} callback
             * @returns {undefined}
             */
            forEach(callback) {
                return forEachKey(this, callback);
            },
            /**
             * @param {forEachKeyCallback} callback
             * @returns {Object.<string, *>}
             */
            map(callback) {
                return mapObject(this, callback);
            },
            /**
             * @param {forEachKeyCallback} callback
             * @returns {*[]}
             */
            mapToArray(callback) {
                return mapObjectToArray(this, callback);
            },
            /**
             * @param {reduceCallback} callback
             * @param {*} initialValue
             * @returns {Array|Object|*}
             */
            reduce(callback, initialValue) {
                return reduceObject(this, callback, initialValue);
            },
            /**
             * @returns {number} length
             */
            length() {
                return length(this);
            },
            /**
             * get the value without extended prototype
             * @returns {Object} value
             */
            _value() {
                return {
                    ...this,
                };
            },
            /**
             * remove the prototype extension
             */
            _revert() {
                this.__proto__ = Object.prototype;
            },
            ...Object.prototype
        };
        if (mutate) {
            // eslint-disable-next-line no-param-reassign
            element.__proto__ = proto;
            return element;
        }
        return {
            ...element,
            __proto__: proto
        };
    }
    if (isArray(element)) {
        const proto = {
            /**
             * @returns {boolean}
             */
            isNullOrEmpty() {
                return isNullOrEmpty(this);
            },
            /**
             * @param {selectorCb} callback
             * @returns {*}
             */
            firstOrDefault(callback = () => true) {
                safeFirst(this, callback);
            },
            /**
             * @param {function(*)} selector
             * @returns {null|*[]}
             */
            distinct(selector) {
                return distinct(this, selector);
            },
            /**
             * get the value without extended prototype
             * @returns {*[]}
             */
            _value() {
                return [...this];
            },
            /**
             * remove the prototype extension
             */
            _revert() {
                this.__proto__ = Array.prototype;
            },
            ...Array.prototype
        };
        if (mutate) {
            // eslint-disable-next-line no-param-reassign
            element.__proto__ = proto;
            return element;
        }
        const result = [
            ...element
        ];
        result.__proto__ = proto;
        return result;
    }
    if (isString(element)) {
        const proto = {
            /**
             * @returns {boolean}
             */
            isNullOrEmpty() {
                return isNullOrEmpty(this);
            },
            /**
             * @param {string|RegExp} search
             * @param {string|function} replacement
             * @param {number} [maxReplacements=50]
             * @returns {string}
             */
            replaceAll(search, replacement, maxReplacements = 50) {
                return replaceAll(this, search, replacement, maxReplacements);
            },
            /**
             * get the value without extended prototype
             * @returns {string}
             */
            _value() {
                return Object.values(this).join('');
            },
            /**
             * remove the prototype extension
             */
            _revert() {
                this.__proto__ = String.prototype;
            },
            ...String.prototype
        };
        // eslint-disable-next-line no-new-wrappers
        const result = new String(element);
        result.__proto__ = proto;
        return result;
    }
    if (isNumber(element)) {
        const proto = {
            /**
             * get the value without extended prototype
             * @returns {number}
             */
            _value() {
                return Number(this);
            },
            /**
             * remove the prototype extension
             */
            _revert() {
                this.__proto__ = Number.prototype;
            },
            ...Number.prototype
        };
        // eslint-disable-next-line no-new-wrappers
        const result = new Number(element);
        result.__proto__ = proto;
        return result;
    }
    if (isFunction(element)) {
        return element;
    }
    if (isBoolean(element)) {
        return element;
    }
    if (isDate(element)) {
        const proto = {
            /**
             * get the value without extended prototype
             * @returns {Date}
             */
            _value() {
                return new Date(this);
            },
            /**
             * remove the prototype extension
             */
            _revert() {
                this.__proto__ = Date.prototype;
            },
            /**
             * @param {number} ms - amount of ms to add
             * @param {boolean} m - mutate original data
             * @returns {Date}
             */
            add(ms, m = false) {
                if (m) this.setTime(this.getTime + ms);
                const date = new Date();
                date.setTime(this.getTime() + ms);
                return date;
            },
            /**
             * @param {number} min - amount of ms to add
             * @param {boolean} m - mutate original data
             * @returns {Date}
             */
            addMinutes(min, m = false) {
                if (m) this.setTime(this.getTime() + min * time.minute);
                const date = new Date();
                date.setTime(this.getTime() + min * time.minute);
                return date;
            },
            /**
             * @param {number} h - amount of ms to add
             * @param {boolean} m - mutate original data
             * @returns {Date}
             */
            addHours(h, m = false) {
                if (m) this.setTime(this.getTime() + h * time.hour);
                const date = new Date();
                date.setTime(this.getTime() + h * time.hour);
                return date;
            },
            /**
             * @param {number} d - amount of ms to add
             * @param {boolean} m - mutate original data
             * @returns {Date}
             */
            addDays(d, m = false) {
                if (m) this.setTime(this.getTime() + d * time.day);
                const date = new Date();
                date.setTime(this.getTime() + d * time.day);
                return date;
            },
            /**
             * @param {number} s - amount of ms to add
             * @param {boolean} m - mutate original data
             * @returns {Date}
             */
            addSeconds(s, m = false) {
                if (m) this.setTime(this.getTime() + s * time.second);
                const date = new Date();
                date.setTime(this.getTime() + s * time.second);
                return date;
            },
            /**
             * @param {number} ms - amount of ms to round up to
             * @param {boolean} m - mutate original data
             * @returns {Date}
             */
            roundUp(ms, m = false) {
                if (m) this.setTime(Math.ceil(this.getTime() / ms) * ms);
                const date = new Date();
                date.setTime(Math.ceil(this.getTime() / ms) * ms);
                return date;
            },
            /**
             * DateFns format
             * @param {string} formatString
             * @param {boolean} [useToday=false]
             * @returns {string}
             */
            format(formatString, useToday = false) {
                return fnsFormat(this, formatString, useToday);
            },
            ...Date.prototype
        };
        if (mutate) {
            // eslint-disable-next-line no-param-reassign
            element.__proto__ = proto;
            return element;
        }
        const result = new Date(element);
        result.__proto__ = proto;
        return result;
    }
    if (isPromise(element)) {
        return element;
    }
    console.error('[Types] Element is not of a valid extendable type');
    return element;
};

const regex = {
    number: /^[\d]*$/,
    integer: /^[0-9]*$/,
    httpsUrl: /(?:(?:(?:https):)\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/i,
    whitespace: /^ +$/
};

const types = {
    isArray,
    isObject,
    isBasedOnObject,
    isFunction,
    isString,
    isDate,
    isBoolean,
    isNumber,
    isCleanNumber,
    isInteger,
    isPromise,
    types: typeStrings,
    safeFirst,
    distinct,
    getType,
    length,
    isNullOrEmpty,
    replaceEmpty,
    safeValue,
    hasKey,
    forEachKey,
    mapObject,
    mapObjectToArray,
    reduceObject,
    replaceAll,
    regex,
    extend
};

export default types;
