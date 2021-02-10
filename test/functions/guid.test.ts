import Guid from '../../src/functions/guid';

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-4][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;

describe('functions/guid', () => {
    it('generates guid without crashing', () => {
        expect(Guid.generateGuid()).toMatch(guidRegex);
    })
})
