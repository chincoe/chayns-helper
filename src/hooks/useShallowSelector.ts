import shallowEqual from '../functions/shallowEqual';
import useSelector from '../utils/requireUseSelector';

/**
 * react-redux useSelector with shallowEqual
 * @param func
 */
// @ts-expect-error
const useShallowSelector = <T>(func: (state: any) => T) => useSelector(func, shallowEqual);

export default useShallowSelector;
