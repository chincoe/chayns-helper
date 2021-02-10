import roundDate from '../../../src/functions/timeHelper/roundDate';

describe('functions/timeHelper/roundDate', () => {
    it('runs without crashing', () => {
        roundDate(new Date());
    })
})
