import { useState } from 'react';

export type UseUniqueTimeoutResult = [
    (fn: () => unknown, timeout: number) => number,
    (timeout: number) => number
];

/**
 * Unique timeout: Setting a new timeout will clear the previous one
 * @param initialValue
 */
const useUniqueTimeout = (
    initialValue = 0
): UseUniqueTimeoutResult => {
    const [customTimeout, setCustomTimeout] = useState<number>(initialValue);

    const setter = (timeout: number): number => {
        clearTimeout(customTimeout);
        setCustomTimeout(timeout);
        return timeout;
    };

    const wrappedSetter = (fn: () => unknown, timeout: number) => setter(<number><unknown>setTimeout(fn, timeout));

    return [wrappedSetter, setter];
};

export default useUniqueTimeout;
