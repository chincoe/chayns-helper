import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SuspenseWaitCursor from '../../src/components/wait-cursor/SuspenseWaitCursor';

describe('components/SuspenseWaitCursor', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<SuspenseWaitCursor><p/></SuspenseWaitCursor>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
