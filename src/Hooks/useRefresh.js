import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to keep refreshing a component in an interval by using the refreshId as id somewhere
 * @param interval
 * @return {[number, function]}
 */
const useRefresh = (interval = null) => {
    const [refresh, setRefresh] = useState(0);

    const manualRefresh = useCallback(() => {
        setRefresh(Math.random());
    }, []);

    useEffect(() => {
        let val = 0;
        if (interval) {
            val = setInterval(() => {
                manualRefresh();
            }, interval);
        }
        return () => { clearInterval(val); };
    }, []);

    return [refresh, manualRefresh];
};

export default useRefresh;
