import { useState } from 'react';

/**
 * Unique event listener: Setting a new event listener will remove the previous one
 * @param {*} initialValue
 * @return {function(element: Element, event: string, pListener: function)}
 */
const useUniqueEventListener = (initialValue) => {
    const [listener, setListener] = useState(initialValue);

    const setter = (element, event, pListener) => {
        element.removeEventListener(event, listener);
        element.addEventListener(event, pListener);
        setListener(pListener);
    };

    return setter;
};

export default useUniqueEventListener;
