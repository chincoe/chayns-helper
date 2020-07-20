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
export const hexToRgb = (hex) => {
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
export const getChaynsColor = (name) => chayns.utils.colors.getColorFromPalette(name);

/**
 * Gets the RGB color Object ob a chayns color
 * @param {string} name
 * @return {rgbColorObject} - RGB color. Format: { r: 100, g: 100, b: 100 }
 */
export const getChaynsColorRgb = (name) => hexToRgb(getChaynsColor(name));

/**
 * Mix 2 chayns colors and return the RGB Object
 * @param {string} name1
 * @param {string} name2
 * @param {number} [saturation=50] - ratio of color 1 to color 2
 * @return {rgbColorObject} - RGB color. Format: { r: 100, g: 100, b: 100 }
 */
export const mixChaynsColorRgb = (name1, name2, saturation = 50) => {
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
export const borderColorClass = (c, i = false) => `chayns__border-color--${c}${i ? 'i' : ''}`;
/**
 * Get a chayns background color class
 * @param {string} c - the color name
 * @param {boolean} i - important or not?
 * @return {string}
 */
export const backgroundColorClass = (c, i = false) => `chayns__background-color--${c}${i ? 'i' : ''}`;
/**
 * Get a chayns color class
 * @param {string} c - the color name
 * @param {boolean} i - important or not?
 * @return {string}
 */
export const colorClass = (c, i = false) => `chayns__color--${c}${i ? 'i' : ''}`;
