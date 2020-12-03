import { useEffect, useState } from 'react';

export default function useUpdateEffect(effect, deps) {
    const [isFirstRender, setIsFirstRender] = useState(true);
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return (() => {});
        }
        return (effect()) || (() => {});
    }, deps);
}
