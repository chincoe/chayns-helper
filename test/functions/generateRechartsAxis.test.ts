import { generateRechartsAxis } from '../../src/functions/generateRechartsAxis';

describe('functions/generateRechartsAxis', () => {
    it('runs without crashing', () => {
        generateRechartsAxis({
            start: 0, end: 100, divisor: 5, maxTicks: 5, minTicks: 3
        });
        generateRechartsAxis({
            start: 0, end: 100, divisor: [5, 10, 25], maxTicks: 5, minTicks: 3
        });
    });
    it('calculates the right values', () => {
        expect(generateRechartsAxis({
            start: 0, end: 100, divisor: 5, maxTicks: 5, minTicks: 3
        })).toMatchObject({
            intervalCount: 5,
            intervalLength: 20,
            min: 0,
            max: 100,
            ticks: [0, 20, 40, 60, 80]
        })
        expect(generateRechartsAxis({
            start: 0, end: 100, divisor: [5, 10, 25], maxTicks: 5, minTicks: 3
        }))
            .toMatchObject({
                intervalCount: 4,
                intervalLength: 25,
                min: 0,
                max: 100,
                ticks: [0, 25, 50, 75]
            })
    })
})
