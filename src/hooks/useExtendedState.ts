import React, { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * useState hook that includes an async getter to get the current state in e.g. eventListeners or other functions
 * that have to keep their reference as well as a way to retain a prevState from a previous render
 * @param initialState
 * @param deps
 */
export default function useExtendedState<T>(
    initialState: T | (() => T),
    deps?: Array<any>
): [T, React.Dispatch<SetStateAction<T>>, () => Promise<T>, T | undefined] {
    const [state, setState] = useState<T>(initialState);

    const getState = useCallback(async () => new Promise<T>((resolve) => {
        setState((prev) => {
            resolve(prev);
            return prev;
        });
    }), []);

    const prevState = useRef<T>();
    useEffect(() => {
        prevState.current = state;
    }, [state, ...(deps || [])]);
    const prev = useMemo<T | undefined>(() => prevState.current, [state, ...(deps || [])]);

    return [state, setState, getState, prev];
}
