import { useCallback, useEffect, useState } from 'react';

/**
 * Hook to keep refreshing a component in an interval by using the refreshId as id somewhere
 * @param interval
 * @return {[number, function]}
 */
const useRefresh = (interval: number): [number, () => void] => {
    const [refresh, setRefresh] = useState(0);

    const manualRefresh = useCallback(() => {
        setRefresh(Math.random());
    }, []);

    useEffect(() => {
        let val: NodeJS.Timeout | number;
        if (interval) {
            val = setInterval(() => {
                manualRefresh();
            }, interval);
        }
        return () => {
            clearInterval((val as NodeJS.Timeout) || 0);
        };
    }, [manualRefresh]);

    return [refresh, manualRefresh];
};

export default useRefresh;
