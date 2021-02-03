import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CenteredWaitCursor from '../../src/components/wait-cursor/CenteredWaitCursor';

describe('components/CenteredWaitCursor', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<CenteredWaitCursor/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
