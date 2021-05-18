import React from 'react';

/**
 * Gets the current state of a hook based on the setter
 */
const getHookState = <T>(setter: React.Dispatch<React.SetStateAction<T>>): Promise<T> => new Promise((resolve) => {
    setter((state: T) => {
        resolve(state);
        return state;
    });
});

export default getHookState;
