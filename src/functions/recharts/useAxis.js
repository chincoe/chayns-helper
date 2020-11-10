import { useMemo } from 'react';
import generateAxis from './generateAxis';

/**
 * Usage:
 * const tickInfo = useAxis(min, max, divisor, maxTicks, minTicks, formatter);
 * ...
 *  <YAxis
 *      ticks={tickInfo.ticks}
 *      tickCount={ickInfo.intervalCount}
 *      domain={[tickInfo.min, tickInfo.max]}
 *      interval="preserveStart"
 *  />
 *
 * @param {number|*} start - minimum value of data or axis start
 * @param {number|*} end - maximum value of data
 * @param {number|number[]} divisor - for all axis ticks: tick % divisor = 0
 * @param {number} maxTicks - maximum amount of ticks
 * @param {number} minTicks - minimum amount of ticks
 * @param {tickFormatter} [tickFormatter] - function to format
 *
 * @param {*[]} deps - useMemo dependencies
 * @returns {{min: *, max: *, ticks: [], intervalCount: number, intervalLength: number}}
 */
const useAxis = (
    {
        start,
        end,
        divisor,
        maxTicks,
        minTicks = 0,
        tickFormatter
    }, deps
) => useMemo(() => generateAxis(start, end, divisor, maxTicks, minTicks, tickFormatter), deps);

export default useAxis;
