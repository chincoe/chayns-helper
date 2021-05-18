import { useState } from 'react';

/**
 * Unique interval: Setting a new interval will clear the previous one
 * @param initialValue
 */
const useUniqueInterval = (
    initialValue: number = <number><unknown>setTimeout(() => null, 0)
): [
    (fn: () => unknown, interval: number) => number,
    // eslint-disable-next-line function-paren-newline
    (interval: number) => number
] => {
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
