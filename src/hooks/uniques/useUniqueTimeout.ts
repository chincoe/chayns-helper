import { useState } from 'react';

/**
 * Unique timeout: Setting a new timeout will clear the previous one
 */
const useUniqueTimeout = (
    initialValue: NodeJS.Timeout | number = 0
): [(fn: () => any, timeout: number) => NodeJS.Timeout, (timeout: NodeJS.Timeout) => NodeJS.Timeout] => {
    const [customTimeout, setCustomTimeout] = useState<NodeJS.Timeout>(<NodeJS.Timeout>initialValue);

    const setter = (timeout: NodeJS.Timeout) => {
        clearTimeout(customTimeout);
        setCustomTimeout(timeout);
        return timeout;
    };

    const wrappedSetter = (fn: () => any, timeout: number) => {
        return setter(setTimeout(fn, timeout));
    }

    return [wrappedSetter, setter];
};

export default useUniqueTimeout;
