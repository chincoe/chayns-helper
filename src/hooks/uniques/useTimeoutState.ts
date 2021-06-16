import React, { useEffect, useState } from 'react';
import shallowEqual from '../../functions/shallowEqual';
import useUniqueTimeout from './useUniqueTimeout';

/**
 * useState that will call onChange only after no change has been made for a time equal to timeout ms
 * @param initialValue - initial value of the useState()
 * @param onChange - function to be called when the timeout has passed. Received the current value as parameter
 * @param timeout - time in ms that has to pass without a new setter to call onChange
 * @param equalityFn - write a custom override to check equality of old and new value to prevent updates
 */
const useTimeoutState = <T>(
    initialValue: T | undefined,
    onChange: (value: T) => unknown,
    timeout = 500,
    equalityFn?: (newValue: T, oldValue: T|undefined) => boolean
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(initialValue as T);
    const [previousState, setPreviousState] = useState<T | undefined>(initialValue);
    const [setStateTimeout] = useUniqueTimeout();

    const equalFn = typeof equalityFn === 'function' ? equalityFn : (val: T, prevVal: T|undefined) => (
        typeof val === 'string' || typeof prevVal === 'string'
            ? `${val}` === `${prevVal}`
            : shallowEqual(val, prevVal)
    );

    useEffect(() => {
        if (!equalFn(state, previousState)) {
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
