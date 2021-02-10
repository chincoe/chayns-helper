import React, { useState, useCallback } from 'react';


/**
 * useState hook that can handle promises:
 *  - can call setState(Promise) and this hook will resolve it
 *  - can pass an async setter function to setState(), e.g. setState(async (prevState) => {....})
 */
export default function useAsyncState<T>(
    initialState?: T|Promise<T>
): [T|Promise<T>|undefined, React.Dispatch<React.SetStateAction<T|Promise<T>>>] {
    const [state, setState] = useState(initialState);
    if (initialState && typeof (<Promise<T>>initialState)?.then === 'function') {
        Promise.resolve(initialState).then(setState);
    }

    const setter = useCallback((newValue) => new Promise((r) => {
        if (newValue && typeof (<Promise<T>>newValue)?.then === 'function') {
            Promise.resolve(newValue).then(setState);
        } else if (typeof (newValue) === 'function') {
            const prevStatePromise = new Promise((resolve) => {
                setState((prev) => {
                    resolve(prev);
                    return prev;
                });
            });
            prevStatePromise.then((prevState) => {
                const nextValue = newValue(prevState);
                if (nextValue && typeof (<Promise<T>>nextValue)?.then === 'function') {
                    Promise.resolve(nextValue).then((res) => {
                        setState(res);
                        r(undefined);
                    });
                } else {
                    setState(nextValue);
                    r(undefined);
                }
            });
        } else {
            setState(newValue);
            r(undefined);
        }
    }), []);

    return [state, setter];
}
