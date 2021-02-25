import { useState } from 'react';

/**
 * Unique interval: Setting a new interval will clear the previous one
 * @param initialValue
 */
const useUniqueInterval = (
    initialValue: number = <number><unknown>setTimeout(() => null, 0)
): [(fn: () => any, interval: number) => number, (interval: number) => number] => {
    const [customInterval, setCustomInterval] = useState<number>(initialValue);

    const setter = (interval: number): number => {
        clearInterval(customInterval);
        setCustomInterval(interval);
        return interval;
    };

    const wrappedSetter = (fn: () => any, interval: number) => {
        return setter(<number><unknown>setInterval(fn, interval));
    }

    return [wrappedSetter, setter];
};

export default useUniqueInterval;
