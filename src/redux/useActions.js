import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';

/**
 * Hook to generate action creators and bind them
 * @param {string[]} actions
 * @param {*[]} deps
 * @return {*|*[]}
 */
const useActions = (actions, deps) => {
    const dispatch = useDispatch();
    return useMemo(
        () => {
            if (Array.isArray(actions)) {
                return actions.map((a) => bindActionCreators(a, dispatch));
            }
            return bindActionCreators(actions, dispatch);
        },
        deps ? [dispatch, ...deps] : [dispatch]
    );
};

export default useActions;
