import { useState } from 'react';

/**
 * Unique timeout: Setting a new timeout will clear the previous one
 */
const useUniqueTimeout = (initialValue: NodeJS.Timeout = setTimeout(v => v, 0)): ((timeout: NodeJS.Timeout) => NodeJS.Timeout) => {
    const [customTimeout, setCustomTimeout] = useState<NodeJS.Timeout>(initialValue);

    const setter = (timeout: NodeJS.Timeout) => {
        clearTimeout(customTimeout);
        setCustomTimeout(timeout);
        return timeout;
    };

    return setter;
};

export default useUniqueTimeout;
