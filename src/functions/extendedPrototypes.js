/* eslint-disable no-proto,no-underscore-dangle */
import time from '../constants/time';
import stringToColor from './colors/stringToColor';
import fnsFormat from './timeHelper/fnsFormat';
import types from './types';

/**
 * @type {{Array: {__proto__: any, isNullOrEmpty(): boolean, firstOrDefault(selectorCb=): *, distinct(function(*)):
 *     (null|*[]), _value(): *[], any(*=): *, _revert(): void}, Promise: extendedPrototypes.ExtendedPromise, Number:
 *     {__proto__: any, _value(): number, _revert(): void}, Object: {reduce(reduceCallback, *): (Array|Object|*),
 *     __proto__: any, isNullOrEmpty(): boolean, forEach(forEachKeyCallback): undefined,
 *     mapToArray(forEachKeyCallback): *[], toArray(): Array<{key: string, value: *}>, length(): number, _value(): {},
 *     tryGet(string): (null|*), map(forEachKeyCallback): Object<string, *>, _revert(): void}, String: {__proto__: any,
 *     isNullOrEmpty(): boolean, toColor(?boolean=): (null|{r: number, g: number, b: number, a: ?number}|String),
 *     _value(): string, replaceAll((string|RegExp), (string|Function), number=): string, _revert(): void}, Date:
 *     {add(number, boolean=): Date, __proto__: any, addSeconds(number, boolean=): Date, addMinutes(number, boolean=):
 *     Date, format(string, boolean=): string, _value(): Date, addDays(number, boolean=): Date, _revert(): void,
 *     roundUp(number, boolean=): Date, addHours(number, boolean=): Date}}}
 */
const extendedPrototypes = {
    Object: {
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
    },
    Array: {
        any(callback) {
            return !!this.find(callback || (() => true));
        },
        /**
         * @returns {boolean}
         */
        isNullOrEmpty() {
            return types.isNullOrEmpty(this);
        },
        /**
         * @param {selectorCb} [callback]
         * @returns {*}
         */
        firstOrDefault(callback) {
            return types.safeFirst(this, callback || (() => true));
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
    },
    String: {
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
        replaceAll(search, replacement, maxReplacements) {
            return types.replaceAll(this, search, replacement, maxReplacements ?? 50);
        },
        /**
         * @param {?boolean} [rgb=false]
         * @returns {null|{r: number, g: number, b: number, a: ?number}|String}
         */
        toColor(rgb) {
            return stringToColor(this, rgb);
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
    },
    Promise: class ExtendedPromise extends Promise {
        status = 'pending';

        value = null;

        constructor(promise) {
            super((resolve, reject) => {
                promise.then((result) => {
                    this.status = 'fulfilled';
                    resolve(result);
                }, (result) => {
                    this.status = 'rejected';
                    reject(result);
                });
            });
            this.value = promise;
        }
    },
    Number: {
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
    },
    Date: {
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
         * @param {boolean} [m=false] - mutate original data
         * @returns {Date}
         */
        add(ms, m) {
            if (m) this.setTime(this.getTime + ms);
            const date = new Date();
            date.setTime(this.getTime() + ms);
            return date;
        },
        /**
         * @param {number} min - amount of ms to add
         * @param {boolean} [m=false] - mutate original data
         * @returns {Date}
         */
        addMinutes(min, m) {
            if (m) this.setTime(this.getTime() + min * time.minute);
            const date = new Date();
            date.setTime(this.getTime() + min * time.minute);
            return date;
        },
        /**
         * @param {number} h - amount of ms to add
         * @param {boolean} [m=false] - mutate original data
         * @returns {Date}
         */
        addHours(h, m) {
            if (m) this.setTime(this.getTime() + h * time.hour);
            const date = new Date();
            date.setTime(this.getTime() + h * time.hour);
            return date;
        },
        /**
         * @param {number} d - amount of ms to add
         * @param {boolean} [m=false] - mutate original data
         * @returns {Date}
         */
        addDays(d, m) {
            if (m) this.setTime(this.getTime() + d * time.day);
            const date = new Date();
            date.setTime(this.getTime() + d * time.day);
            return date;
        },
        /**
         * @param {number} s - amount of ms to add
         * @param {boolean} [m=false] - mutate original data
         * @returns {Date}
         */
        addSeconds(s, m) {
            if (m) this.setTime(this.getTime() + s * time.second);
            const date = new Date();
            date.setTime(this.getTime() + s * time.second);
            return date;
        },
        /**
         * @param {number} ms - amount of ms to round up to
         * @param {boolean} [m=false] - mutate original data
         * @returns {Date}
         */
        roundUp(ms, m) {
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
        format(formatString, useToday) {
            return fnsFormat(this, formatString, useToday ?? false);
        },
        __proto__: Date.prototype
    }
};

export default extendedPrototypes;
