import { useRef, useEffect, useMemo } from 'react';

export default function usePreviousEffect(effect: (prev?: any[]) => void, deps?: any[]): void {
    const previousValues = useRef(deps);
    useEffect(() => {
        previousValues.current = deps;
    }, deps);
    const prev = useMemo(() => previousValues.current, deps);
    return useEffect(() => (effect(prev)), deps);
}
