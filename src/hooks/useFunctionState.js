import { useState, useCallback } from 'react';

/**
 * functions usually can't be directly put into a state. This state can contain functions
 * @param initialState
 * @return {[function(), function(function)]}
 */
const useFunctionState = (initialState) => {
    const [state, setState] = useState({ call: initialState ?? (() => null) });
    const setter = useCallback((func) => {
        // check type
        if (func && {}.toString.call(func) === '[object Function]') { setState({ call: func }); }
    }, []);
    return [state.call, setter];
};

export default useFunctionState;
