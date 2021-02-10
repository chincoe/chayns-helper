import hexToRgb, { RGBAObject } from '../../../src/functions/colors/hexToRgb';

describe('functions/colors/hexToRgb', () => {
    it('runs without crashing', () => {
        hexToRgb('#ff0000');
    });
    it('calculates the right values', () => {
        const rgb = <RGBAObject>hexToRgb('#ff0000')
        expect(rgb.r).toBe(255);
        expect(rgb.g).toBe(0);
        expect(rgb.b).toBe(0);
        expect(rgb.a).toBe(null);
    })
    it('can be stringified correctly', () => {
        const rgb = <RGBAObject>hexToRgb('#ff0000');
        expect(rgb.toString()).toMatch('rgb(255, 0, 0)');
    })
})
