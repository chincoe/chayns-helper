import { useState } from 'react';

export type UseUniqueIntervalResult = [
    (fn: () => unknown, interval: number) => number,
    (interval: number) => number
];

/**
 * Unique interval: Setting a new interval will clear the previous one
 * @param initialValue
 */
const useUniqueInterval = (
    initialValue: number = <number><unknown>setTimeout(() => null, 0)
): UseUniqueIntervalResult => {
    const [customInterval, setCustomInterval] = useState<number>(initialValue);

    const setter = (interval: number): number => {
        clearInterval(customInterval);
        setCustomInterval(interval);
        return interval;
    };

    const wrappedSetter = (fn: () => unknown, interval: number) => setter(<number><unknown>setInterval(fn, interval));

    return [wrappedSetter, setter];
};

export default useUniqueInterval;
