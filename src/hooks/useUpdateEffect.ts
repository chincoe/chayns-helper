import React, { useEffect, useState } from 'react';

/**
 * A useEffect that won't run on the first render, similarly to willComponentUpdate
 * @param effect
 * @param deps
 */
export default function useUpdateEffect(effect: React.EffectCallback, deps?: any[]) {
    const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return (() => {});
        }
        return (effect()) || (() => {});
    }, deps);
}
