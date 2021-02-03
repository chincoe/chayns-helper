import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ResizableWaitCursor from '../../src/components/wait-cursor/ResizableWaitCursor';

describe('components/ResizableWaitCursor', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<ResizableWaitCursor size={32}/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
