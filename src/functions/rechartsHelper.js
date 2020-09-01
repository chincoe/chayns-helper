import { useMemo } from 'react';

export const generateAxis = (
    start,
    end,
    divisor,
    maxTicks,
    minTicks,
    tickFormatter = (base, intervalLength, i) => (base + intervalLength * i)
) => {
    const difference = end - start;
    const intervalLength = Math.ceil(difference / divisor / maxTicks) * divisor;
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

export const useAxis = (
    {
        start,
        end,
        divisor,
        maxTicks,
        minTicks = 0,
        tickFormatter = (base, intervalLength, i) => (base + intervalLength * i)
    }, deps
) => useMemo(() => generateAxis(start, end, divisor, maxTicks, minTicks, tickFormatter), deps);
