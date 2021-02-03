import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ErrorBoundary from '../../src/components/error-boundary/ErrorBoundary'

describe('components/DataRow', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <ErrorBoundary>
                <p>Hello World</p>
            </ErrorBoundary>,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
