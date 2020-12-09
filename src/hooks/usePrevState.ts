import React, {
    useState,
    useRef,
    useEffect,
    useMemo, SetStateAction
} from 'react';

/**
 * @template T
 * @param {T} [initialState]
 * @param {?*[]} [deps]
 * @returns {[T, function(T), T]} - [state, setState, prevState]
 */
export default function usePrevState<T>(
    initialState: T,
    deps?: any[]
): [T, React.Dispatch<SetStateAction<T>>, T | undefined] {
    const [state, setState] = useState(initialState);
    const prevState = useRef<T>();
    useEffect(() => {
        prevState.current = state;
    }, [state, ...(deps || [])]);
    const prev = useMemo(() => prevState.current, [state, ...(deps || [])]);

    return [state, setState, prev];
}
