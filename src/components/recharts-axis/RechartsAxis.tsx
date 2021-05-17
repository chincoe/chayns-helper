import React, { FunctionComponent, ReactElement } from 'react';
import useRechartsAxis from '../../functions/generateRechartsAxis';

export interface RechartsAxisProps<T> {
    start: number | T;
    end: number | T;
    divisor: number | number[];
    minTicks: number;
    maxTicks: number;
    tickFormatter?: (start: number | T, intervalLength: number, i: number) => (number | T);
}

/**
 * A container to generate a better recharts axis with nicer intervals.
 * Usage:
 *  <RechartsAxis
 *      start={0}
 *      end={112}
 *      divisor={10}
 *      minTicks={3}
 *      maxTicks={5}
 *  >
 *      <XAxis/>
 *  </RechartsAxis>
 *  -> This example would result in ticks at 0, 30, 60 and 90
 *
 *  Do not specify the props "ticks", "tickCount" and "domain" on the child axis, as they will be set by this component.
 *
 * @param start - minimum value
 * @param end - maximum value
 * @param divisor - all ticks will be divisible by this number (or one of these numbers, if it's an array), e.g. if the
 *     divisor is 5, all intervals will be a multiple of 5
 * @param minTicks - minimum amount of ticks
 * @param maxTicks - maximum amounts of ticks
 * @param [tickFormatter] - advanced formatter for the ticks, e.g. to display Dates nicely
 * @param children
 * @constructor
 */
const RechartsAxis: FunctionComponent<RechartsAxisProps<number | Date | unknown>> = ({
    start,
    end,
    divisor,
    minTicks,
    maxTicks,
    tickFormatter,
    children
}) => {
    const tickInfo = useRechartsAxis({
        start,
        end,
        divisor,
        maxTicks,
        minTicks,
        tickFormatter
    }, [start, end, divisor, minTicks, maxTicks, children]);
    const relevantChild = (Array.isArray(children) ? children[0] : children) as ReactElement;
    return React.cloneElement(
        relevantChild,
        {
            ticks: tickInfo.ticks,
            tickCount: tickInfo.intervalCount,
            domain: [tickInfo.min, tickInfo.max],
            interval: 'preserveStart'
        }
    );
};

export default RechartsAxis;
