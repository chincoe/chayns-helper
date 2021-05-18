import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ErrorBoundary from '../../src/components/error-boundary/ErrorBoundary';


describe('components/ErrorBoundary', () => {
    it('renders without crashing', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore this is not an error, just shows up as one in the IDE
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
