import * as React from 'react';
import * as ReactDOM from 'react-dom';
import rerender from '../../src/components/other/rerender';

describe('components/rerenderHOC', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        const Component = rerender(() => (<div/>));
        ReactDOM.render(<Component/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
