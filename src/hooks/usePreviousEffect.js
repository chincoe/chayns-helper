import { useRef, useEffect, useMemo } from 'react';

/**
 * @callback prevEffect
 * @param {?*[]} prevValues
 */

/**
 * @param {prevEffect} effect
 * @param {?*[]} [deps]
 */
export default function usePreviousEffect(effect, deps) {
    const previousValues = useRef(deps);
    useEffect(() => {
        previousValues.current = deps;
    }, deps);
    const prev = useMemo(() => previousValues.current, deps);
    return useEffect(() => (effect(prev)), deps);
}
