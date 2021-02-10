import toHslColor from '../../../src/functions/colors/toHslColor';

describe('functions/colors/toHslColor', () => {
    it('runs without crashing', () => {
        toHslColor('this is a test string', 50, 60);
    });
    it('calculates the right values', () => {
        expect(toHslColor('this is a test string').toString()).toMatch('hsl(-268,70%,40%)');
    })
})
