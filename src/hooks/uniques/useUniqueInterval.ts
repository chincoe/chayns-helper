import { useState } from 'react';

/**
 * Unique interval: Setting a new interval will clear the previous one
 * @param initialValue
 */
const useUniqueInterval = (
    initialValue: NodeJS.Timeout = setTimeout(v => v, 0)
): [(fn: () => any, interval: number) => NodeJS.Timeout, (interval: NodeJS.Timeout) => NodeJS.Timeout] => {
    const [customInterval, setCustomInterval] = useState<NodeJS.Timeout>(initialValue);

    const setter = (interval: NodeJS.Timeout) => {
        clearInterval(customInterval);
        setCustomInterval(interval);
        return interval;
    };

    const wrappedSetter = (fn: () => any, interval: number) => {
        return setter(setInterval(fn, interval));
    }

    return [wrappedSetter, setter];
};

export default useUniqueInterval;
