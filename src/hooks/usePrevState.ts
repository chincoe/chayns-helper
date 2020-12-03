import {
    useState,
    useRef,
    useEffect,
    useMemo
} from 'react';

/**
 * @template T
 * @param {T} [initialState]
 * @param {?*[]} [deps]
 * @returns {[T, function(T), T]} - [state, setState, prevState]
 */
export default function usePrevState(initialState, deps) {
    const [state, setState] = useState(initialState);
    const prevState = useRef();
    useEffect(() => {
        prevState.current = state;
    }, [state, ...(deps || [])]);
    const prev = useMemo(() => prevState.current, [state, ...(deps || [])]);

    return [state, setState, prev];
}
