import { useState } from 'react';

/**
 * Unique interval: Setting a new interval will clear the previous one
 * @param {number} initialValue
 * @return {function(number): number}
 */
const useUniqueInterval = (initialValue) => {
    const [customInterval, setCustomInterval] = useState(initialValue);

    const setter = (interval) => {
        clearInterval(customInterval);
        setCustomInterval(interval);
        return interval;
    };

    return setter;
};

export default useUniqueInterval;
