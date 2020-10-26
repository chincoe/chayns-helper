import { useState, useCallback } from 'react';

/**
 * useState hook that can handle promises:
 *  - can call setState(Promise) and this hook will resolve it
 *  - can pass an async setter function to setState(), e.g. setState(async (prevState) => {....})
 * @template T
 * @param {T|Promise<T>} [initialState]
 * @returns {[T, function(T|Promise<T>|function(T): T|function(T): Promise<T>)]} - [state, setState]
 */
export default function useAsyncState(initialState) {
    const [state, setState] = useState(initialState);
    if (chayns.utils.isPromise(initialState)) {
        Promise.resolve(initialState).then(setState);
    }

    const setter = useCallback((newValue) => {
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
                    Promise.resolve(nextValue).then((res) => setState(res));
                } else {
                    setState(nextValue);
                }
            });
        }
    }, []);

    return [state, setter];
}
