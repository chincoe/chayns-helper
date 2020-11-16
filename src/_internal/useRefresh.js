import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to keep refreshing a component in an interval by using the refreshId as id somewhere
 * @param {number} interval
 * @return {[number, function]}
 */
const useRefresh = (interval) => {
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
