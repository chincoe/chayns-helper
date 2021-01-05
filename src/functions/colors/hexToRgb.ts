/**
 * Convert a hex string to RGB. The resulting object will have the properties r, g, b and a.
 * The .toString() method of the result will format the object as a css rgb() / rgba() string.
 */
const hexToRgb = (hex: string): ({r: number, g: number, b: number, a: number|null}|string|null) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: null,
        // @ts-expect-error
        __proto__: {
            toString(): string {
                // @ts-expect-error
                return this.a !== null
                    // @ts-expect-error
                    ? `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` : `rgb(${this.r}, ${this.g}, ${this.b})`;
            }
        }
    };
};

export default hexToRgb;
