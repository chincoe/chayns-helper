import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DataRow from '../../../src/components/containers/DataRow'

describe('components/DataRow', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<DataRow />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
