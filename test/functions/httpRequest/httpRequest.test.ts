import request, { httpRequest } from '../../../src/functions/httpRequest/httpRequest';
import fetchMock from 'jest-fetch-mock';
import { ResponseType } from '../../../src/functions/httpRequest/ResponseType';
import generateUUID from '../../../src/functions/generateGuid';

describe('functions/httpRequest/httpRequest', () => {
    beforeAll(() => {
        request.defaults("https://httpRequestTest.com/", {}, {
            responseType: ResponseType.JsonWithStatus
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
                    });
                } else if (req.url.endsWith('/failedToFetch')) {
                    reject(new TypeError("Test Error"))
                } else if (req.url.endsWith('/chaynsError1')) {
                    resolve({
                        status: 403,
                        body: JSON.stringify({
                            errorCode: "test_api/code",
                            requestId: generateUUID()
                        })
                    });
                } else if (req.url.endsWith('/chaynsError2')) {
                    resolve({
                        status: 403,
                        body: JSON.stringify({
                            errorCode: "test_api/p_code",
                            requestId: generateUUID()
                        })
                    });
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
        } catch (ex) {
            expect(ex.statusCode).toBe(1);
        }
    })
    it('handles ChaynsErrors correctly', async () => {
        const [result1, result2] = await Promise.all([
            httpRequest("chaynsError1", {}, "", {
                responseType: ResponseType.Object,
                throwErrors: false,
                errorHandlers: {
                    'test_api/code': () => {
                        return 'code not found';
                    },
                    'test_api/p_code': ResponseType.Json
                }
            }),
            httpRequest("chaynsError2", {}, "", {
                responseType: ResponseType.Object,
                throwErrors: false,
                errorHandlers: {
                    'test_api/code': () => {
                        return 'code not found';
                    },
                    'test_api/p_code': ResponseType.Json
                }
            })
        ]);
        expect(result1).toBe('code not found');
        expect(result2.errorCode).toBe('test_api/p_code');
    })
    afterAll(() => {
        fetchMock.resetMocks();
    })
})
