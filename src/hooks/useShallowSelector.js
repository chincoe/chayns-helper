import { useSelector } from 'react-redux';
import shallowEqual from '../functions/shallowEqual';

/**
 * useSelector mit shallowEqual
 * @param {function} func
 * @return {*} - selected part of state
 */
const useShallowSelector = (func) => useSelector(func, shallowEqual);

export default useShallowSelector;
