// noinspection ES6PreferShortImport

import fetchMock from 'jest-fetch-mock';
import HttpClient from '../../../src/functions/httpRequest/HttpClient';
import { ResponseType } from '../../../src/functions/httpRequest/ResponseType';
import generateUUID from '../../../src/functions/generateGuid';
import { ChaynsError } from '../../../src';

describe('functions/httpRequest/httpRequest', () => {
    const request = new HttpClient({
        address: 'https://httpRequestTest.com/',
        options: {
            responseType: ResponseType.JsonWithStatus
        }
    });

    beforeAll(() => {
        fetchMock.mockIf(/^https?:\/\/httpRequestTest\.com.*$/i, (req) => new Promise((resolve, reject) => {
            if (req.url.endsWith('/defaultGet')) {
                resolve({
                    status: 200,
                    body: JSON.stringify({
                        foo: 1,
                        bar: 2
                    })
                });
            } else if (req.url.endsWith('/failedToFetch')) {
                reject(new TypeError('Test Error'));
            } else if (req.url.endsWith('/chaynsError1')) {
                resolve({
                    status: 403,
                    body: JSON.stringify({
                        errorCode: 'test_api/code',
                        requestId: generateUUID()
                    })
                });
            } else if (req.url.endsWith('/chaynsError2')) {
                resolve({
                    status: 403,
                    body: JSON.stringify({
                        errorCode: 'test_api/p_code',
                        requestId: generateUUID()
                    })
                });
            }
        }));
    });
    it('runs without crashing', async () => {
        const response = await request.fetch(
            'defaultGet',
            {},
            '',
            {}
        );
        expect(response.status).toBe(200);
    });
    it('handles failed to fetch', async () => {
        const { status } = await request.fetch('failedToFetch', {}, '', {});
        expect(status).toBe(1);
    });
    it('handles failed to fetch with throwErrors', async () => {
        try {
            await request.fetch('failedToFetch', {}, '', {});
        } catch (ex) {
            expect(ex.statusCode).toBe(1);
        }
    });
    it('handles ChaynsErrors correctly', async () => {
        const [result1, result2] = await Promise.all([
            request.fetch('chaynsError1', {}, '', {
                responseType: ResponseType.Object,
                throwErrors: false,
                errorHandlers: {
                    'test_api/code': () => 'code not found',
                    'test_api/p_code': ResponseType.Json
                }
            }),
            request.fetch('chaynsError2', {}, '', {
                responseType: ResponseType.Object,
                throwErrors: false,
                errorHandlers: {
                    'test_api/code': () => 'code not found',
                    'test_api/p_code': ResponseType.Json
                }
            })
        ]);
        expect(result1).toBe('code not found');
        expect((result2 as ChaynsError).errorCode).toBe('test_api/p_code');
    });
    afterAll(() => {
        fetchMock.resetMocks();
    });
});
