import copyToClipboard from '../../src/functions/copyToClipboard';

describe('functions/copyToClipboard', () => {
    it('generates guid without crashing', () => {
        copyToClipboard('test');
    })
})
