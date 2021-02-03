import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ErrorBoundary from '../../src/components/error-boundary/ErrorBoundary'

describe('components/ErrorBoundary', () => {
    it('renders without crashing', () => {
        // @ts-ignore
        global.chayns = chayns;
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
