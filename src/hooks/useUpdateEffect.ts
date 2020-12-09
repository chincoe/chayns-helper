import React, { useEffect, useState } from 'react';

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
