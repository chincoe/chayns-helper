import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import useUniqueTimeout from './useUniqueTimeout';

/**
 * useState that will call onChange only after no change has been made for a time equal to timeout ms
 * @param {*} initialValue
 * @param {function(value: *)} onChange
 * @param {number} timeout
 * @return {[*, function]}
 */
const useTimeoutState = (initialValue, onChange, timeout = 500) => {
    const [state, setState] = useState(initialValue);
    const [previousState, setPreviousState] = useState(initialValue);
    const setStateTimeout = useUniqueTimeout();

    useEffect(() => {
        const t = setStateTimeout((
            chayns.utils.isString(state) || chayns.utils.isString(previousState)
                ? `${state}` === `${previousState}`
                : shallowEqual(state, previousState)
        ) || setTimeout(() => {
            setPreviousState(state);
            onChange(state);
        }, timeout));
        return () => {
            clearTimeout(t);
        };
    }, [state]);

    return [
        state,
        setState
    ];
};

export default useTimeoutState;
