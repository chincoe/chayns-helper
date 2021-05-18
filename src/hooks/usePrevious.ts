import { useEffect, useMemo, useRef } from 'react';

/**
 * Retain a value from a previous render
 * @param value
 * @param deps
 */
export default function usePrevious<T>(value: T, deps?: unknown[]): T {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, deps);
    return useMemo(() => ref.current, deps);
}
