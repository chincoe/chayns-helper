import {useMemo} from 'react';

export interface RechartsAxis<T> {
    intervalCount: number,
    intervalLength: number,
    min: number|T,
    max: number|T,
    ticks: Array<number|T>
}

/**
 * Generate data for a good recharts axis that will use customizable intervals
 * Usage:
 * const tickInfo = generateAxis(min, max, divisor, maxTicks, minTicks, formatter);
 * ...
 *  <YAxis
 *      ticks={tickInfo.ticks}
 *      tickCount={ickInfo.intervalCount}
 *      domain={[tickInfo.min, tickInfo.max]}
 *      interval="preserveStart"
 *  />
 *
 * @param start - min value
 * @param end - max value
 * @param divisor - all steps should be divisible by this or one of these numbers
 * @param maxTicks - maximum number of ticks
 * @param minTicks - minimum number of ticks
 * @param tickFormatter - formatter for the ticks, e.g. for dates
 */
export function generateRechartsAxis<T>(
    start: number | T,
    end: number | T,
    divisor: number | number[],
    maxTicks: number,
    minTicks: number,
    tickFormatter?: (start: number | T, intervalLength: number, i: number) => (number | T)
): RechartsAxis<T> {
    // eslint-disable-next-line no-param-reassign
    if (!tickFormatter) tickFormatter = (base, intervalLength, i) => (<number>base + intervalLength * i);

    let relevantDivisor: number|undefined = undefined;
    if (Array.isArray(divisor)) {
        const divisorList = divisor.sort((a: number, b: number) => a - b);
        for (let i = 0; i < divisorList.length; i++) {
            const d = divisorList[i];
            if (d * maxTicks > end) {
                relevantDivisor = <number>d;
                break;
            }
        }
        if (!relevantDivisor) relevantDivisor = divisorList[divisorList.length - 1];
    } else {
        relevantDivisor = <number>divisor;
    }

    const difference = <number>end - <number>start;
    const intervalLength = Math.ceil(difference / relevantDivisor / maxTicks) * relevantDivisor;
    const intervalCount = Math.max(Math.ceil(difference / intervalLength), minTicks);

    const ticks = [];
    for (let i = 0; i < intervalCount; i++) {
        ticks.push(tickFormatter(start, intervalLength, i));
    }

    return {
        intervalCount,
        intervalLength,
        min: start,
        max: tickFormatter(ticks[ticks.length - 1], intervalLength, 1),
        ticks
    };
};

/**
 * Generate data for a good recharts axis that will use customizable intervals
 * Usage:
 * const tickInfo = useRechartsAxis({min, max, divisor, maxTicks, minTicks, tickFormatter} [...deps]);
 * ...
 *  <YAxis
 *      ticks={tickInfo.ticks}
 *      tickCount={tickInfo.intervalCount}
 *      domain={[tickInfo.min, tickInfo.max]}
 *      interval="preserveStart"
 *  />
 *
 * @param start - min value
 * @param end - max value
 * @param divisor - all steps should be divisible by this or one of these numbers
 * @param maxTicks - maximum number of ticks
 * @param minTicks - minimum number of ticks
 * @param tickFormatter - formatter for the ticks, e.g. for dates
 * @param deps - dependencies to indicate when the tick info should be calculated again
 */
const useRechartsAxis = <T>(
    {
        start,
        end,
        divisor,
        maxTicks,
        minTicks = 0,
        tickFormatter
    }: {
        start: number|T,
        end: number|T,
        divisor: number|number[],
        maxTicks: number,
        minTicks: number,
        tickFormatter?: (start: number | T, intervalLength: number, i: number) => (number | T)
    }, deps: Array<any>
): RechartsAxis<T> => useMemo(() => generateRechartsAxis(start, end, divisor, maxTicks, minTicks, tickFormatter), deps);

export default useRechartsAxis;
