/**
 * @typedef rgbColorObject
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */
/**
 * Converts a hex string color to an rgb color object
 * @param hex
 * @return {rgbColorObject} - RGB color. Format: { r: 100, g: 100, b: 100 }
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Gets chayns color. Limited options.
 * @param {string} name
 * @return {string} - Hex color
 */
const getChaynsColor = (name) => chayns.utils.colors.getColorFromPalette(name);

/**
 * Gets the RGB color Object ob a chayns color
 * @param {string} name
 * @return {rgbColorObject} - RGB color. Format: { r: 100, g: 100, b: 100 }
 */
const getChaynsColorRgb = (name) => hexToRgb(getChaynsColor(name));

/**
 * Mix 2 chayns colors and return the RGB Object
 * @param {string} name1
 * @param {string} name2
 * @param {number} [saturation=50] - ratio of color 1 to color 2
 * @return {rgbColorObject} - RGB color. Format: { r: 100, g: 100, b: 100 }
 */
const mixChaynsColorRgb = (name1, name2, saturation = 50) => {
    const c1 = getChaynsColor(name1);
    const c2 = getChaynsColor(name2);
    const result = chayns.utils.colors.mix(c1, c2, saturation);
    return hexToRgb(result);
};

/**
 * Get a chayns border color class
 * @param {string} c - the color name
 * @param {boolean} i - important or not?
 * @return {string}
 */
const borderColorClass = (c, i = false) => `chayns__border-color--${c}${i ? 'i' : ''}`;
/**
 * Get a chayns background color class
 * @param {string} c - the color name
 * @param {boolean} i - important or not?
 * @return {string}
 */
const backgroundColorClass = (c, i = false) => `chayns__background-color--${c}${i ? 'i' : ''}`;
/**
 * Get a chayns color class
 * @param {string} c - the color name
 * @param {boolean} i - important or not?
 * @return {string}
 */
const colorClass = (c, i = false) => `chayns__color--${c}${i ? 'i' : ''}`;

function hashCode(str) { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i) {
    // eslint-disable-next-line no-bitwise
    const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '00000'.substring(0, 6 - c.length) + c;
}

/**
 * @param {string} str - string to be hashed and converted to a hex color
 * @returns {string} hexColor
 */
const getColorFromStringHash = (str) => intToRGB(hashCode(str));

/**
 * @type {{getChaynsColor: (function(string): string), mixChaynsColorRgb: (function(string, string, number=):
 *     rgbColorObject), colorClass: (function(string, boolean=): string), getColorFromStringHash: (function(string):
 *     string), getChaynsColorRgb: (function(string): rgbColorObject), borderColorClass: (function(string, boolean=):
 *     string), hexToRgb: (function(*=): rgbColorObject), backgroundColorClass: (function(string, boolean=): string)}}
 */
const colors = {
    hexToRgb,
    getChaynsColor,
    getChaynsColorRgb,
    mixChaynsColorRgb,
    borderColorClass,
    backgroundColorClass,
    colorClass,
    getColorFromStringHash
};

export default colors;
