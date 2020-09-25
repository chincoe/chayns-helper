/* eslint-disable no-bitwise */
const getHashCode = (string) => {
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        hash &= hash; // Convert to 32bit integer
    }
    return hash;
};

/**
 * @param {string|number} stringOrInt
 * @param {number} s
 * @param {number} l
 * @returns {string|{h: number, s: number, l:number}}
 */
const toHslColor = (stringOrInt, s, l) => {
    const number = chayns.utils.isNumber(stringOrInt) ? stringOrInt : getHashCode(stringOrInt);
    const shortened = number % 360;
    // const result = `hsl(${shortened},${s ?? 70}%,${l ?? 40}%)`;
    return {
        h: shortened,
        s: s ?? 70,
        l: l ?? 40,
        __proto__: {
            /**
             * @returns {string}
             */
            toString() {
                return `hsl(${this.h},${this.s}%,${this.l}%)`;
            }
        }
    };
};

export default toHslColor;
