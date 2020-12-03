import { useState, useCallback } from 'react';

/**
 * useState hook that can handle promises:
 *  - can call setState(Promise) and this hook will resolve it
 *  - can pass an async setter function to setState(), e.g. setState(async (prevState) => {....})
 * @template T
 * @param {?T|Promise<T>} [initialState]
 * @returns {[?T|Promise<T>, function(T|Promise<T>|function(T=): T|function(T=): Promise<T>) : Promise<undefined>]} - [state, setState]
 */
export default function useAsyncState(initialState) {
    const [state, setState] = useState(initialState);
    if (chayns.utils.isPromise(initialState)) {
        Promise.resolve(initialState).then(setState);
    }

    const setter = useCallback((newValue) => new Promise((r) => {
        if (chayns.utils.isPromise(newValue)) {
            Promise.resolve(newValue).then(setState);
        } else if (chayns.utils.isFunction(newValue)) {
            const prevStatePromise = new Promise((resolve) => {
                setState((prev) => {
                    resolve(prev);
                    return prev;
                });
            });
            prevStatePromise.then((prevState) => {
                const nextValue = newValue(prevState);
                if (chayns.utils.isPromise(nextValue)) {
                    Promise.resolve(nextValue).then((res) => {
                        setState(res);
                        r();
                    });
                } else {
                    setState(nextValue);
                    r();
                }
            });
        } else {
            setState(newValue);
            r();
        }
    }), []);

    return [state, setter];
}
