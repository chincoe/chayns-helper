/**
 * @param {Object} options
 * @param {boolean} [options.ignoreNullValues]
 * @param {boolean} [options.includeUndefined]
 * @param {boolean} [options.includeNotSerializable]
 * @param {string[]} [options.excludeKeys]
 *
 * @returns {function(string, *)} replacer
 */
export default function getJsonSettings(options) {
    const {
        ignoreNullValues = false,
        includeUndefined = false,
        includeNotSerializable = false,
        excludeKeys = []
    } = options;
    return function replacer(key, value) {
        if (excludeKeys.includes(key)) {
            return undefined;
        }
        if (ignoreNullValues && value === null) {
            return undefined;
        }
        if (includeUndefined && value === undefined) {
            return null;
        }
        if (chayns.utils.isArray(value)) {
            return value.map((v) => replacer(key, v));
        }
        if (includeNotSerializable) {
            if (!chayns.utils.isNumber(value)
                && !chayns.utils.isString(value)
                && !chayns.utils.isBoolean(value)
                && !chayns.utils.isObject(value)
                && value !== null
                && value !== undefined
            ) {
                return `${value}`;
            }
        }
        return value;
    };
}
