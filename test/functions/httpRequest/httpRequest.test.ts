import request, { httpRequest } from '../../../src/functions/httpRequest/httpRequest';
import fetchMock from 'jest-fetch-mock';
import ResponseType from '../../../src/functions/httpRequest/ResponseType';

describe('functions/httpRequest/httpRequest', () => {
    beforeAll(() => {
        request.defaults("https://httpRequestTest.com/", {}, {
            responseType: ResponseType.Status.Json
        });

        fetchMock.mockIf(/^https?:\/\/httpRequestTest\.com.*$/i, (req) => {
            return new Promise((resolve, reject) => {
                if (req.url.endsWith('/defaultGet')) {
                    resolve({
                        status: 200,
                        body: JSON.stringify({
                            foo: 1,
                            bar: 2
                        })
                    })
                } else if (req.url.endsWith('/failedToFetch')) {
                    reject(new TypeError("Test Error"))
                }
            })
        })
    })
    it('runs without crashing', async () => {
        const response = await httpRequest(
            "defaultGet",
            {},
            "",
            {}
        );
        expect(response.status).toBe(200);
    });
    it('handles failed to fetch', async () => {
        const { status } = await httpRequest("failedToFetch", {}, "", {});
        expect(status).toBe(1);
    })
    it('handles failed to fetch with throwErrors', async () => {
        try {
            await httpRequest("failedToFetch", {}, "", {});
        } catch(ex) {
            expect(ex.statusCode).toBe(1);
        }
    })
    afterAll(() => {
        fetchMock.resetMocks();
    })
})
