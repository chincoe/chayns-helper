import { useState } from 'react';

/**
 * Unique interval: Setting a new interval will clear the previous one
 * @param initialValue
 */
const useUniqueInterval = (initialValue: NodeJS.Timeout = setTimeout(v => v, 0)): (interval: NodeJS.Timeout) => NodeJS.Timeout => {
    const [customInterval, setCustomInterval] = useState<NodeJS.Timeout>(initialValue);

    const setter = (interval: NodeJS.Timeout) => {
        clearInterval(customInterval);
        setCustomInterval(interval);
        return interval;
    };

    return setter;
};

export default useUniqueInterval;
