/* eslint-disable no-proto,no-underscore-dangle */
import types from './types';
import fnsFormat from './timeHelper/fnsFormat';
import time from '../constants/time';

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
const extend = (element, mutate = false) => {
    if (element === null || element === undefined) {
        return element;
    }
    if (types.isObject(element)) {
        const proto = {
            /**
             * @returns {Array.<{key: string, value:*}>}
             */
            toArray() {
                return types.mapObjectToArray(this, (key, value) => ({ key, value }));
            },
            /**
             * @returns {boolean}
             */
            isNullOrEmpty() {
                return types.isNullOrEmpty(this);
            },
            /**
             * @param {string} key
             * @returns {null|*}
             */
            tryGet(key) {
                return types.safeValue(this, key);
            },
            /**
             * @param {forEachKeyCallback} callback
             * @returns {undefined}
             */
            forEach(callback) {
                return types.forEachKey(this, callback);
            },
            /**
             * @param {forEachKeyCallback} callback
             * @returns {Object.<string, *>}
             */
            map(callback) {
                return types.mapObject(this, callback);
            },
            /**
             * @param {forEachKeyCallback} callback
             * @returns {*[]}
             */
            mapToArray(callback) {
                return types.mapObjectToArray(this, callback);
            },
            /**
             * @param {reduceCallback} callback
             * @param {*} initialValue
             * @returns {Array|Object|*}
             */
            reduce(callback, initialValue) {
                return types.reduceObject(this, callback, initialValue);
            },
            /**
             * @returns {number} length
             */
            length() {
                return types.length(this);
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
            __proto__: Object.prototype
        };
        if (mutate) {
            // eslint-disable-next-line no-param-reassign
            element.__proto__ = proto;
            return element;
        }
        const resultElement = { ...element };
        resultElement.__proto__ = proto;
        return resultElement;
    }
    if (types.isArray(element)) {
        const proto = {
            /**
             * @returns {boolean}
             */
            isNullOrEmpty() {
                return types.isNullOrEmpty(this);
            },
            /**
             * @param {selectorCb} callback
             * @returns {*}
             */
            firstOrDefault(callback = () => true) {
                return types.safeFirst(this, callback);
            },
            /**
             * @param {function(*)} selector
             * @returns {null|*[]}
             */
            distinct(selector) {
                return types.distinct(this, selector);
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
            __proto__: Array.prototype
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
    if (types.isString(element)) {
        const proto = {
            /**
             * @returns {boolean}
             */
            isNullOrEmpty() {
                return types.isNullOrEmpty(this);
            },
            /**
             * @param {string|RegExp} search
             * @param {string|function} replacement
             * @param {number} [maxReplacements=50]
             * @returns {string}
             */
            replaceAll(search, replacement, maxReplacements = 50) {
                return types.replaceAll(this, search, replacement, maxReplacements);
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
            __proto__: String.prototype
        };
        // eslint-disable-next-line no-new-wrappers
        const result = new String(element);
        result.__proto__ = proto;
        return result;
    }
    if (types.isNumber(element)) {
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
            __proto__: Number.prototype
        };
        // eslint-disable-next-line no-new-wrappers
        const result = new Number(element);
        result.__proto__ = proto;
        return result;
    }
    if (types.isFunction(element)) {
        return element;
    }
    if (types.isBoolean(element)) {
        return element;
    }
    if (types.isDate(element)) {
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
            __proto__: Date.prototype
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
    if (types.isPromise(element)) {
        return element;
    }
    console.error('[Types] Element is not of a valid extendable type');
    return element;
};

export default extend;
