import * as React from 'react';
import * as ReactDOM from 'react-dom';
import UACGroupChooseButton from '../../src/components/buttons/UACGroupChooseButton'

describe('components/UACGroupChooseButton', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<UACGroupChooseButton value={1} onChange={console.log} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
