import shallowEqual, { deepEqual } from '../../src/functions/shallowEqual'

describe('functions/shallowEqual', function () {
    it('runs without crashing', function () {
        shallowEqual(null, null);
    });
    it('checks correctly for shallow equality', () => {
        const arr = [1, 2, 3];
        const value1 = { a: 1, b: [1, 2, 3] }
        const value2 = { a: 1, b: [1, 2, 3] }
        expect(shallowEqual(value1, value2)).toBeFalsy();
        value1.b = arr;
        value2.b = arr;
        expect(shallowEqual(value1, value2)).toBeTruthy();
    })
});

describe('functions/shallowEqual.deepEqual', function () {
    it('runs without crashing', function () {
        deepEqual(null, null)
    });
    it('checks correctly for deep equality', () => {
        const value1 = { a: 1, b: { arr: [1, 2, 3] } }
        const value2 = { a: 1, b: { arr: [1, 2, 3] } }
        expect(deepEqual(value1, value2)).toBeTruthy();
    })
});
