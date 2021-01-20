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
    if (chayns.utils.isPromise(initialState)) {
        Promise.resolve(initialState).then(setState);
    }

    const setter = useCallback((newValue) => new Promise((r) => {
        if (chayns.utils.isPromise(newValue)) {
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
                if (chayns.utils.isPromise(nextValue)) {
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
