import { shallowEqual, useSelector } from 'react-redux';

/**
 * useSelector mit shallowEqual
 * @param {function} func
 */
const useShallowSelector = (func) => useSelector(func, shallowEqual);

export default useShallowSelector;
