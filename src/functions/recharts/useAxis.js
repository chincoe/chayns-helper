import { useMemo } from 'react';
import generateAxis from './generateAxis';

/**
 * @param {number|*} start - minimum value of data or axis start
 * @param {number|*} end - maximum value of data
 * @param {number} divisor - for all axis ticks: tick % divisor = 0
 * @param {number} maxTicks - maximum amount of ticks
 * @param {number} minTicks - minimum amount of ticks
 * @param {tickFormatter} tickFormatter - function to format
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
        tickFormatter = (base, intervalLength, i) => (base + intervalLength * i)
    }, deps
) => useMemo(() => generateAxis(start, end, divisor, maxTicks, minTicks, tickFormatter), deps);

export default useAxis;
