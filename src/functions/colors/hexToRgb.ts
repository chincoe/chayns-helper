
const hexToRgb = (hex: string): ({r: number, g: number, b: number, a: number|null}|string|null) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: null,
        // @ts-ignore
        __proto__: {
            /**
             * @returns {string}
             */
            toString(): string {
                // @ts-ignore
                return this.a !== null
                    // @ts-ignore
                    ? `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` : `rgb(${this.r}, ${this.g}, ${this.b})`;
            }
        }
    };
};

export default hexToRgb;
