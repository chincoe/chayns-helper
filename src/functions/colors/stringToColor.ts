import hexToRgb, { RGBAObject } from './hexToRgb';

/**
 * Hash a string and turn it into an RGB color to get predictable colors out of strings.
 */
const stringToColor = (str: string, rgb?: boolean): (RGBAObject|String|null) => {
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
    // @ts-expect-error
    result.__proto__ = {
        /**
         * @param {number} a
         * @returns {null|{r: number, g: number, b: number, a: ?number}}
         */
        toRgb(a?: number) {
            const rgbValue = hexToRgb(this);
            if (a) (<RGBAObject>rgbValue).a = a;
            return rgbValue;
        },
        __proto__: String.prototype
    };
    return result;
};

export default stringToColor;
