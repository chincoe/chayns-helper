import shallowEqual from '../functions/shallowEqual';
import useSelector from '../utils/requireUseSelector';

// @ts-ignore
const useShallowSelector = <T>(func: (state: any) => T) => useSelector(func, shallowEqual);

export default useShallowSelector;
