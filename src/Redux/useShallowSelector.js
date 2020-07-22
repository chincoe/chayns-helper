import { shallowEqual } from 'react-redux';
import { chaynsHelperConfig } from '../chaynsHelperConfig';

/**
 * useSelector mit shallowEqual
 * @param {function} func
 * @return {*} - selected part of state
 */
const useShallowSelector = (func) => chaynsHelperConfig.getSelector()(func, shallowEqual);

export default useShallowSelector;
