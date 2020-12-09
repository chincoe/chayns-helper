import {useMemo} from 'react';


export interface RechartsAxis<T> {
    intervalCount: number,
    intervalLength: number,
    min: number|T,
    max: number|T,
    ticks: Array<number|T>
}

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
    if (chayns.utils.isArray(divisor) && typeof divisor !== "number") {
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
