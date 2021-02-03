import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Refresh from '../../../src/components/rerender/RefreshComponent';

describe('components/Refresh', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Refresh interval={10000}><p/></Refresh>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
