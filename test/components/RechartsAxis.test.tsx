import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RechartsAxis from '../../src/components/recharts-axis/RechartsAxis';

describe('components/RechartsAxis', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        const Component = ({
            ticks, tickCount, domain, interval
        }: Record<string, unknown>) => (<div>{`${ticks},${tickCount},${domain},${interval}`}</div>);
        ReactDOM.render(
            <RechartsAxis divisor={5} start={0} end={100} maxTicks={5} minTicks={3}>
                <Component/>
            </RechartsAxis>, div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
