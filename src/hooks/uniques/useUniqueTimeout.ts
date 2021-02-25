import { useState } from 'react';

/**
 * Unique timeout: Setting a new timeout will clear the previous one
 * @param initialValue
 */
const useUniqueTimeout = (
    initialValue: number = 0
): [(fn: () => any, timeout: number) => number, (timeout: number) => number] => {
    const [customTimeout, setCustomTimeout] = useState<number>(initialValue);

    const setter = (timeout: number): number => {
        clearTimeout(customTimeout);
        setCustomTimeout(timeout);
        return timeout;
    };

    const wrappedSetter = (fn: () => any, timeout: number) => {
        return setter(<number><unknown>setTimeout(fn, timeout));
    }

    return [wrappedSetter, setter];
};

export default useUniqueTimeout;
