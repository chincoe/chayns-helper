import {
    useState, useCallback, useRef, useMemo, useEffect
} from 'react';

/**
 * useState hook that includes an async getter to get the current state in e.g. eventListeners or other functions that
 * have to keep their reference as well as a way to retain a prevState from a previous render
 * @template T
 * @param {T|function():T} initialState
 * @param {*[]} [deps=[state]]
 * @returns {[T, function(T|function(T):T), function(): Promise<T>, T]} - [state, setState, getState, prevState]
 */
export default function useExtendedState(initialState, deps) {
    const [state, setState] = useState(initialState);

    const getState = useCallback(async () => new Promise((resolve) => {
        setState((prev) => {
            resolve(prev);
            return prev;
        });
    }), []);

    const prevState = useRef();
    useEffect(() => {
        prevState.current = state;
    }, [state, ...(deps || [])]);
    const prev = useMemo(() => prevState.current, [state, ...(deps || [])]);

    return [state, setState, getState, prev];
}
