import { useState } from 'react';

/**
 * Unique timeout: Setting a new timeout will clear the previous one
 * @param {number} initialValue
 * @return {function(*=): *}
 */
const useUniqueTimeout = (initialValue = 0) => {
    const [customTimeout, setCustomTimeout] = useState(initialValue);

    const setter = (timeout) => {
        clearTimeout(customTimeout);
        setCustomTimeout(timeout);
        return timeout;
    };

    return setter;
};

export default useUniqueTimeout;
