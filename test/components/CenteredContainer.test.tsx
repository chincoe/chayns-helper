import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CenteredContainer from '../../src/components/containers/CenteredContainer'

describe('components/CenteredContainer', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<CenteredContainer gap />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
