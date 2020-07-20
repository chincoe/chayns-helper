import { useMemo } from 'react';
import types from 'chayns-helper/Functions/types';

/**
 * Delete customProps keys from props so you can spread the props to an HTML element
 * @param {Object} props
 * @param {Object} customProps
 * @return {Object} elementProps
 */
export const removeCustomProps = (props, customProps) => {
    const p = { ...props };
    types.forEachKey(customProps, (key) => {
        delete p[key];
    });
    return p;
};

/**
 * Delete customProps keys from props so you can spread the props to an HTML element
 * @param {Object} props
 * @param {Object} customProps
 * @return {Object} elementProps
 */
const useElementProps = (props, customProps) => useMemo(
    () => removeCustomProps(props, customProps), [customProps, props]
);
export default useElementProps;
