import shallowEqual, { deepEqual } from '../functions/shallowEqual';
import useSelector from '../utils/requireUseSelector';

/**
 * react-redux useSelector with shallowEqual
 * @param func
 * @param deep
 */
const useComparingSelector = <T>(func: (state: unknown) => T, deep = false): T => useSelector(
    // @ts-expect-error typings are wrong due to optional react-redux import
    func, deep ? deepEqual : shallowEqual
);

export default useComparingSelector;
