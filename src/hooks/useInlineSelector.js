import { useCallback } from 'react';
import useShallowSelector from './useShallowSelector';

/**
 * useSelector for inline selectors.
 * If you use an inline selector or use e.g. the props inside your selector, the selector will run every time the
 * component is rendered. To circumvent that, this selectors keeps the reference of the selector function and only
 * updates it when a dependency (e.g. the props) is updated.
 *
 * If you want to write an impure function that depends on e.g. props to extract store data, please pay attention to
 * these aspects:
 *  - Make sure that you specify a default value and add dependencies to update the selector
 *  - If the selected instance from store may be deleted, make sure that you handle null values after the point that
 * uses props. E.g. do not use (state) => state.instance[props.id].name, use (state) => state.instance[props.id]?.name
 * instead (or const { name } = useInlineSelector(state => state.instance[props.id], {}, [props.id]) to take advantage of the default value). Even if deleting the specific value in the store will unmount the component calling this selector, the
 * selector might still run before unmounting and throw an error as result if you do not follow this advice.
 *
 * @template T
 * @param {function(*) : T} selector - the selector function
 * @param {T} [defaultValue] - use this if you want to use an impure selector function that uses e.g. props
 * @param {*[]} [deps=[]] - use this if you want to use an impure selector function that uses e.g. props that can
 *     change
 * @returns {T}
 */
export default function useInlineSelector(selector, defaultValue, deps) {
    const memo = useCallback(selector, (deps || []));
    return useShallowSelector(memo) ?? defaultValue;
}
