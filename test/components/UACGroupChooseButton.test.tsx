import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import fetchMock from 'jest-fetch-mock';
import UACGroupChooseButton from '../../src/components/buttons/UACGroupChooseButton';

describe('components/UACGroupChooseButton', () => {
    let div: HTMLDivElement;
    beforeAll(() => {
        div = document.createElement('div');
    });
    it('renders without crashing', () => {
        fetchMock.mockOnce(() => new Promise((resolve) => {
            resolve({
                status: 200,
                body: JSON.stringify([{ id: 1, showName: 'Manager' }])
            });
        }));
        act(() => {
            // eslint-disable-next-line no-console
            ReactDOM.render(<UACGroupChooseButton value={1} onChange={console.log}/>, div);
        });
    });
    it('can deal with a failed UAC Group fetch', () => {
        fetchMock.mockOnce(() => new Promise((resolve, reject) => {
            reject(new TypeError('Failed to fetch'));
        }));
        act(() => {
            // eslint-disable-next-line no-console
            ReactDOM.render(<UACGroupChooseButton value={1} onChange={console.log}/>, div);
        });
    });
    afterEach(async () => {
        await new Promise((res) => setTimeout(res, 100));
        ReactDOM.unmountComponentAtNode(div);
        fetchMock.resetMocks();
    });
});
