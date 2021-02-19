import * as React from 'react';
import * as ReactDOM from 'react-dom';
import getHookState from '../../src/functions/getHookState';
import { act } from 'react-dom/test-utils';
import { useEffect } from 'react';
import { debuglog } from 'util';

const App = () => {
    const [state, setState] = React.useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            getHookState(setState).then(v => setState(v + 1));
        }, 100)
        return () => clearInterval(interval);
    }, [])

    const increment = React.useCallback(() => {

    }, [])

    return <React.Fragment>
        <p id="test-state">{state}</p>
    </React.Fragment>
}

describe('components/getHookState', () => {
    let container: Element | HTMLDivElement | null = null;

    beforeEach(() => {
        // set up a DOM element as a render target
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        // cleanup on exiting
        ReactDOM.unmountComponentAtNode(container as Element);
        container?.remove();
        container = null;
    });
    it('renders without crashing and gets the hook state correctly', async () => {
        act(() => {
            ReactDOM.render(<App/>, container);
        })
        expect(container?.textContent).toBe("0");
        await new Promise(res => setTimeout(res, 350));
        expect(container?.textContent).toBe("3");
    });
});
