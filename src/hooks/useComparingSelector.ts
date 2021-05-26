import shallowEqual, { deepEqual } from '../functions/shallowEqual';
import useSelector from '../utils/requireUseSelector';

/**
 * react-redux useSelector with shallowEqual
 * @param func
 * @param deep
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useComparingSelector<TResult>(func: (state: any) => TResult, deep?: boolean): TResult

/**
 * react-redux useSelector with shallowEqual
 * @param func
 * @param deep
 */
function useComparingSelector<TState, TResult>(func: (state: TState) => TResult, deep?: boolean): TResult

/**
 * react-redux useSelector with shallowEqual
 * @param func
 * @param deep
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useComparingSelector(func: (state: any) => any, deep = false): any {
    return useSelector(
        // @ts-expect-error typings are wrong due to optional react-redux import
        func, deep ? deepEqual : shallowEqual
    );
}

export default useComparingSelector;
