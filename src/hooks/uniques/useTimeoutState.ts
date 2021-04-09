import React, { useEffect, useState } from 'react';
import shallowEqual from '../../functions/shallowEqual';
import useUniqueTimeout from './useUniqueTimeout';

/**
 * useState that will call onChange only after no change has been made for a time equal to timeout ms
 * @param initialValue - initial value of the useState()
 * @param onChange - function to be called when the timeout has passed. Received the current value as parameter
 * @param timeout - time in ms that has to pass without a new setter to call onChange
 */
const useTimeoutState = <T>(
    initialValue: T | any,
    onChange: (value: T) => any,
    timeout: number = 500
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(initialValue);
    const [previousState, setPreviousState] = useState(initialValue);
    const [setStateTimeout] = useUniqueTimeout();

    useEffect(() => {
        if (typeof state === 'string' || typeof previousState === 'string'
            ? `${state}` !== `${previousState}`
            : !shallowEqual(state, previousState)
        ) {
            const t = setStateTimeout(() => {
                setPreviousState(state);
                onChange(state);
            }, (timeout ?? 500));
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
