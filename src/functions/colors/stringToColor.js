import hexToRgb from './hextToRgb';

/**
 * Convert a string to a color
 * @param {string} str
 * @param {?boolean} [rgb]
 * @returns {null|{r: number, g: number, b: number, a: ?number }|String}
 */
const stringToColor = (str, rgb) => {
    /* eslint-disable no-bitwise */
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash &= hash; // Convert to 32bit integer
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += (`00${value.toString(16)}`).substr(-2);
    }
    if (rgb) return hexToRgb(color);
    // eslint-disable-next-line no-new-wrappers
    const result = new String(color);
    // eslint-disable-next-line no-proto
    result.__proto__ = {
        /**
         * @param {number} a
         * @returns {null|{r: number, g: number, b: number, a: ?number}}
         */
        toRgb(a) {
            const rgbValue = hexToRgb(this);
            if (a) rgbValue.a = a;
            return rgbValue;
        },
        __proto__: String.prototype
    };
    return result;
};

export default stringToColor;
