import { useState } from 'react';

/**
 * Unique timeout: Setting a new timeout will clear the previous one
 * @param initialValue
 */
const useUniqueTimeout = (
    initialValue = 0
): [
    (fn: () => unknown, timeout: number) => number,
    // eslint-disable-next-line function-paren-newline
    (timeout: number) => number
] => {
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
