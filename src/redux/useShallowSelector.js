import { shallowEqual, useSelector } from 'react-redux';

/**
 * useSelector mit shallowEqual
 * @param {function} func
 * @return {*} - selected part of state
 */
const useShallowSelector = (func) => useSelector(func, shallowEqual);

export default useShallowSelector;
