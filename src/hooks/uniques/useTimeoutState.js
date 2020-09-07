import { useEffect, useState } from 'react';
import shallowEqual from '../../functions/shallowEqual';
import useUniqueTimeout from './useUniqueTimeout';

/**
 * useState that will call onChange only after no change has been made for a time equal to timeout ms
 * @param {*} initialValue
 * @param {function(value: *)} onChange
 * @param {number} [timeout=500]
 * @return {[*, function]}
 */
const useTimeoutState = (initialValue, onChange, timeout) => {
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
        }, (timeout ?? 500)));
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
