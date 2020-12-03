import { useRef, useEffect, useMemo } from 'react';

/**
 * @template T
 * @param {T} value
 * @param {?*[]} [deps]
 * @returns {T}
 */
export default function usePrevious(value, deps) {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, deps);
    return useMemo(() => ref.current, deps);
}
