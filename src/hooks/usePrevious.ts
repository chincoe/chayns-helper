import { useRef, useEffect, useMemo } from 'react';

export default function usePrevious<T>(value: T, deps?: any[]): T {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, deps);
    return useMemo(() => ref.current, deps);
}
