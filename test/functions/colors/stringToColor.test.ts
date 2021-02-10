import stringToColor from '../../../src/functions/colors/stringToColor';
import { RGBAObject } from '../../../src/functions/colors/hexToRgb';

describe('functions/colors/stringToColor', () => {
    it('runs without crashing', () => {
        const color = stringToColor('this is a test string');
        expect(color.toString()).toMatch('#ec6eaa');
    });
    it('generates consistent colors for consistent input', () => {
        expect(stringToColor('TEST').toString()).toMatch(stringToColor('TEST').toString());
        expect(stringToColor('FOO').toString()).toMatch(stringToColor('FOO').toString());
        expect(stringToColor('BAR').toString()).toMatch(stringToColor('BAR').toString());
    });
    it('generates valid hex colors', () => {
        expect(stringToColor(Math.random().toString(10)).toString()).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(stringToColor(Math.random().toString(10)).toString()).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(stringToColor(Math.random().toString(10)).toString()).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
    it('can convert to rgb properly', () => {
        const color = stringToColor('this is a test string');
        // @ts-expect-error
        const rgb = <RGBAObject>color.toRgb();
        expect(rgb.toString()).toMatch('rgb(236, 110, 170)');
    });
})
