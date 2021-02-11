import React, { SetStateAction, useEffect, useMemo, useRef, useState } from 'react';

/**
 * A useState hook that retains its previously set value as 3rd return value
 * @param [initialState]
 * @param [deps]
 * @returns [state, setState, prevState]
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
