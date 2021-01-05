const isArray = (arr: any): boolean => (Array.isArray(arr));
const isObject = (obj: any) => (Object.prototype.toString.call(obj) === '[object Object]');
const isBasedOnObject = (obj: any) => (obj !== null && typeof (obj) === 'object');
const isFunction = (func: any): boolean => (typeof (func) === 'function');
const isBoolean = (func: any): boolean => (typeof (func) === 'boolean');
const isString = (string: any): boolean => (typeof (string) === 'string');
const isDate = (date: any): boolean => (Object.prototype.toString.call(date) === '[object Date]');
// eslint-disable-next-line no-restricted-globals
const isNumber = (num: any): boolean => (typeof (num) === 'number' && !isNaN(num));
// eslint-disable-next-line no-restricted-globals
const isFiniteNumber = (num: any): boolean => (typeof (num) === 'number' && num !== Infinity && !(isNaN(num)));
// eslint-disable-next-line no-restricted-globals
const isInteger = (int: any): boolean => (typeof (int) === 'number' && int !== Infinity && !(isNaN(int)) && int % 1 === 0);
// eslint-disable-next-line no-prototype-builtins
const isPromise = (prom: any): boolean => Promise.prototype.isPrototypeOf(prom);

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

const safeFirst = <T>(arr: Array<T>, callback?: (value: T, index: number, array: Array<T>) => boolean): null | T => {
    if (!isArray(arr)) return null;
    const relevantArray = (arr || []);
    if (!isFunction(callback)) return relevantArray[0] || null;
    // @ts-expect-error
    return relevantArray.filter(callback)[0] || null;
};

/**
 * Array.distinct(selector)
 */
const distinct = (arr: any[], selector: (value: any) => any): any[] | null => {
    if (!isArray(arr) || !isFunction(selector)) return null;
    return arr.reduce((total, current) => {
        const idx = total.findIndex((t: any) => selector(t) === selector(current));
        if (idx >= 0) {
            const result = [...total];
            result[idx] = current;
            return result;
        }
        return [...total, current];
    }, []);
};

/**
 * get Type string. More different types than typeof
 */
const getType = (val: any): string => ({}.toString.call(val))
    .replace('[object ', '')
    .replace(']', '')
    .toLowerCase();

/**
 * length of array or string, count of number digits or count of object keys
 */
const length = (val: any[] | object | string | number): number => {
    if (!isArray(val) && !isString(val) && !isObject(val) && !isNumber(val)) return 0;
    const type = getType(val);
    switch (type) {
        case 'object':
            return (Object.keys(val) || []).length;
        case 'string':
            return (<string>(val || '')).length;
        case 'array':
            return (<Array<any>>(val || [])).length;
        case 'number':
            return (`${val}` || '').length;
        default:
            return 0;
    }
};

const isNullOrEmpty = (value: any): boolean => {
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

const forEachKey = <T>(
    obj: { [key: string]: T },
    callback: (key: string, value: T, index: number, source: { [key: string]: T }) => void
) => {
    if (!isObject(obj) || !isFunction(callback)) return;
    const keys = Object.keys(obj);
    for (let i = 0; i < length(keys); i += 1) {
        callback(keys[i], obj[keys[i]], i, obj);
    }
};

/**
 * Map object to another object
 */
const mapObject = <T, TResult>(
    obj: { [key: string]: T },
    callback: (key: string, value: T, index: number, source: { [key: string]: T }) => TResult
): { [key: string]: TResult } => {
    if (!isObject(obj) || !isFunction(callback)) return {};
    const keys = Object.keys(obj);
    const newObj: { [key: string]: TResult | T } = {...obj};
    for (let i = 0; i < length(keys); i += 1) {
        newObj[keys[i]] = callback(keys[i], obj[keys[i]], i, obj);
    }
    return <{ [key: string]: TResult }>newObj;
};

/**
 * Map object to an array
 */
const mapObjectToArray = <T, TResult>(
    obj: { [key: string]: T },
    callback: (key: string, value: T, index: number, source: { [key: string]: T }) => TResult
): TResult[] => {
    if (!isObject(obj) || !isFunction(callback)) return [];
    const keys = Object.keys(obj);
    const arr = [];
    for (let i = 0; i < length(keys); i += 1) {
        arr[i] = callback(keys[i], obj[keys[i]], i, obj);
    }
    return arr;
};

/**
 * like Array.reduce but for objects
 */
const reduceObject = (
    obj: { [key: string]: any },
    callback: (total: object, key: string, value: any, index: number, source: { [key: string]: any }) => any,
    initialValue: object = {}
): any => {
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
const replaceAll = (string: string, search: string|RegExp, replacement: string|((substring: string, ...args:any[]) => string), maxReplacements = 50) => {
    let i = 0;
    let newString = string;
    while (i < maxReplacements) {
        // @ts-expect-error
        const tempString = newString.replace(search, replacement);
        if (tempString === newString) {
            return tempString;
        }
        newString = tempString;
        i++;
    }
    return newString;
};

const regex = {
    number: /^[\d]*$/,
    integer: /^[0-9]*$/,
    // eslint-disable-next-line max-len
    httpsUrl: /(?:(?:(?:https):)\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/i,
    whitespace: /^ +$/
};

/**
 * a collection of helpers for type checking, arrays and objects
 */
const types = {
    isArray,
    isObject,
    isBasedOnObject,
    isFunction,
    isString,
    isDate,
    isBoolean,
    isNumber,
    isFiniteNumber,
    isInteger,
    isPromise,
    types: typeStrings,
    safeFirst,
    distinct,
    getType,
    length,
    isNullOrEmpty,
    forEachKey,
    mapObject,
    mapObjectToArray,
    reduceObject,
    replaceAll,
    regex
};

export default types;
