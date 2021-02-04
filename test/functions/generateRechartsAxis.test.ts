import { generateRechartsAxis } from '../../src/functions/recharts/useRechartsAxis';

describe('functions/generateRechartsAxis', () => {
    it('runs without crashing', () => {
        generateRechartsAxis(0, 100, 5, 5, 3);
        generateRechartsAxis(0, 100, [5, 10, 25], 5, 3);
    });
    it('calculates the right values', () => {
        expect(generateRechartsAxis(0, 100, 5, 5, 3)).toMatchObject({
            intervalCount: 5,
            intervalLength: 20,
            min: 0,
            max: 100,
            ticks: [0, 20, 40, 60, 80]
        })
        expect(generateRechartsAxis(0, 100, [5, 10, 25], 5, 3)).toMatchObject({
            intervalCount: 4,
            intervalLength: 25,
            min: 0,
            max: 100,
            ticks: [0, 25, 50, 75]
        })
    })
})
