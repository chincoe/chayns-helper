import generateUid from './generateUid';

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-4][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

/**
 * A custom GUID class
 * @class
 */
export default class Guid {
    value = '';

    /**
     * @static
     * @type {function(): string}
     * @public
     */
    static generateGuid = generateUid;

    /**
     * @param {?string} str
     * @constructor
     */
    constructor(str: string = '') {
        if (str && guidRegex.test(str)) {
            this.value = str;
        } else if (str) {
            // eslint-disable-next-line no-console
            console.warn('[Guid] Invalid Guid:', str);
        } else {
            this.value = generateUid();
        }
    }

    /**
     * @public
     * @returns {string}
     */
    toString() {
        return this.value;
    }
}
