/**
 * Convert a hex string to an rgb object
 * @param {string} hex
 * @returns {null | {r: number, g: number, b: number, a: ?number }}
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: null,
        __proto__: {
            /**
             * @returns {string}
             */
            toString() {
                return this.a !== null
                       ? `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
                       : `rgb(${this.r}, ${this.g}, ${this.b})`;
            }
        }
    };
};

export default hexToRgb;
