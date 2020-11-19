import shallowEqual from '../functions/shallowEqual';
import useSelector from '../utils/requireUseSelector';

/**
 * useSelector mit shallowEqual
 * @param {function} func
 * @return {*} - selected part of state
 */
const useShallowSelector = (func) => useSelector(func, shallowEqual);

export default useShallowSelector;
