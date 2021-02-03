import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RestrictedAccordion from '../../src/components/restricted-accordion/RestrictedAccordion';

describe('components/RestrictedAccordion', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<RestrictedAccordion head="Test"><p/></RestrictedAccordion>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
