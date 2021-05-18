import { useEffect, useMemo, useRef } from 'react';

/**
 * A useEffect hook that receives the previous render's dependencies as argument
 * @param effect
 * @param deps
 */
export default function usePreviousEffect<T>(effect: (prev?: T[]) => void, deps?: T[]): void {
    const previousValues = useRef(deps);
    useEffect(() => {
        previousValues.current = deps;
    }, deps);
    const prev = useMemo(() => previousValues.current, deps);
    return useEffect(() => (effect(prev)), deps);
}
