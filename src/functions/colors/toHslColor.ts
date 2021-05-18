/* eslint-disable no-bitwise */

const getHashCode = (string: string): number => {
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        hash &= hash; // Convert to 32bit integer
    }
    return hash;
};

/**
 * Turn a string or int into an hsl color object. Ideal to create predictable colors that will always have a certain
 * saturation
 * @param stringOrInt
 * @param s
 * @param l
 */
const toHslColor = (
    stringOrInt: string | number,
    s?: number,
    l?: number
): {
    // eslint-disable-next-line function-paren-newline
    h: number, s: number, l: number, readonly toString: () => string
} => {
    const number: number = typeof (stringOrInt) === 'number' ? stringOrInt : getHashCode(stringOrInt);
    const shortened: number = number % 360;
    // const result = `hsl(${shortened},${s ?? 70}%,${l ?? 40}%)`;
    return {
        h: shortened,
        s: s ?? 70,
        l: l ?? 40,
        toString(): string {
            return `hsl(${this.h},${this.s}%,${this.l}%)`;
        }

    };
};

export default toHslColor;
