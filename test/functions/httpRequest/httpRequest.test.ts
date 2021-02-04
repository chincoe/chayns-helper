import request, { httpRequest } from '../../../src/functions/httpRequest/httpRequest';
import fetchMock from 'jest-fetch-mock';

describe('functions/httpRequest/httpRequest', () => {
    beforeAll(() => {
        request.defaults("https://httpRequestTest.com/", {}, {});

        fetchMock.mockIf(/^https?:\/\/httpRequestTest\.com.*$/, "test")
    })
    it('runs without crashing', async () => {
        const response = await httpRequest(
            "defaultGet",
            {},
            "",
            {}
            );
        console.info(response);
    });
    afterAll(() => {
        fetchMock.resetMocks();
    })
})
