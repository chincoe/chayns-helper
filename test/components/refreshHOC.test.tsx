import * as React from 'react';
import * as ReactDOM from 'react-dom';
import refresh from '../../src/components/other/refresh';

describe('components/refreshHOC', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        const Component = refresh(() => (<div/>), 10000);
        ReactDOM.render(<Component/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
