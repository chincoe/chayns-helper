export type RGBAObject = {
    r: number;
    g: number;
    b: number;
    a: number | null;
    readonly toString: () => string;
};

/**
 * Convert a hex string to RGB. The resulting object will have the properties r, g, b and a.
 * The .toString() method of the result will format the object as a css rgb() / rgba() string.
 * @param hex
 */
const hexToRgb = (hex: string): (RGBAObject | string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: null,
        toString(): string {
            const rgba: RGBAObject = <RGBAObject>this
            return rgba.a !== null
                ? `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` : `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
        }

    };
};

export default hexToRgb;
