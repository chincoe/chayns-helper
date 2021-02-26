import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as request from '../../src/functions/httpRequest/httpRequest';
import UACGroupChooseButton from '../../src/components/buttons/UACGroupChooseButton'
import { act } from 'react-dom/test-utils';

describe('components/UACGroupChooseButton', () => {
    let div: HTMLDivElement;
    beforeAll(() => {
        div = document.createElement('div');
    })
    it('renders without crashing', () => {
        request.default.fetch = () => {
            return new Promise<Array<{ id: number, showName: string }>>((res) => {
                res([{ id: 1, showName: 'Manager' }])
            })
        }
        act(() => {
            ReactDOM.render(<UACGroupChooseButton value={1} onChange={console.log}/>, div);
        });
    });
    it('can deal with a failed UAC Group fetch', () => {
        request.default.fetch = () => {
            return new Promise<Array<{ id: number, showName: string }>>((res, rej) => {
                rej(new TypeError("Failed to fetch"))
            })
        }
        act(() => {
            ReactDOM.render(<UACGroupChooseButton value={1} onChange={console.log}/>, div);
        });
    })
    afterEach(async () => {
        await new Promise(res => setTimeout(res, 100));
        ReactDOM.unmountComponentAtNode(div);
        request.default.fetch = request.httpRequest;
    })
});
