import shallowEqual, { deepEqual } from '../functions/shallowEqual';
import useSelector from '../utils/requireUseSelector';

/**
 * react-redux useSelector with shallowEqual
 * @param func
 * @param deep
 */
const useComparingSelector = <T>(func: (state: any) => T, deep: boolean = false) =>
    // @ts-expect-error
    useSelector(func, deep ? deepEqual : shallowEqual);

export default useComparingSelector;
