import generateGuid from '../../src/functions/generateGuid';

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-4][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

describe('functions/generateGuid', () => {
    it('generates guid without crashing', () => {
        expect(generateGuid()).toMatch(guidRegex);
    })
})
