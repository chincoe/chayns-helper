import React, {useEffect, useState} from 'react';
import shallowEqual from '../../functions/shallowEqual';
import useUniqueTimeout from './useUniqueTimeout';


/**
 * useState that will call onChange only after no change has been made for a time equal to timeout ms
 */
const useTimeoutState = <T>(
    initialValue: T,
    onChange: (value: T) => any,
    timeout: number = 500
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(initialValue);
    const [previousState, setPreviousState] = useState(initialValue);
    const setStateTimeout = useUniqueTimeout();

    useEffect(() => {
        if (chayns.utils.isString(state) || chayns.utils.isString(previousState)
            ? `${state}` === `${previousState}`
            : shallowEqual(state, previousState)) {
            const t = setStateTimeout(setTimeout(() => {
                setPreviousState(state);
                onChange(state);
            }, (timeout ?? 500)));
            return () => {
                clearTimeout(t);
            };
        }
        return () => null;
    }, [state]);

    return [
        state,
        setState
    ];
};

export default useTimeoutState;
