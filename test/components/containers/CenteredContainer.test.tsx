import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CenteredContainer from '../../../src/components/containers/CenteredContainer'
import { act } from 'react-dom/test-utils';

describe('components/CenteredContainer', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        act(() => {
            ReactDOM.render(<CenteredContainer gap><p>Hello world</p><p>Hello world</p></CenteredContainer>, div);
        });
        ReactDOM.unmountComponentAtNode(div);
        act(() => {
            ReactDOM.render(
                <CenteredContainer className="test-name" style={{ color: 'red' }} elementType="span">
                    <p>Hello world</p>
                </CenteredContainer>,
                div
            );
        });
        ReactDOM.unmountComponentAtNode(div);
        act(() => {
            ReactDOM.render(<CenteredContainer/>, div);
        });
        ReactDOM.unmountComponentAtNode(div);
    });
});
