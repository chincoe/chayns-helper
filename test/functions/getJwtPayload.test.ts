import getJwtPayload from '../../src/functions/getJwtPayload';

const testBase64String = 'eyBhbGc6dGVzdCB9.eyAiRmlyc3ROYW1lIjogICJKb2huIiwgIkxhc3ROYW1lIjogIkRvZSJ9.eW91IGRpZG4ndCBhY3R1YWxseSB0aGluayB0aGVyZSB3b3VsZCBiZSBhIHNlY3JldCBoZXJlLCBkaWQgeW91';

describe('functions/getJwtPayload', () => {
    it('runs without crashing', () => {
        getJwtPayload(testBase64String);
    })
    it('does not crash on invalid input', () => {
        const result = getJwtPayload('foobar');
        expect(result).toBe(null);
    })
    it('extracts a payload correctly', () => {
        const result = getJwtPayload(testBase64String);
        expect(result?.FirstName).toBe('John');
    })
})
