import { useEffect } from 'react';

/**
 * Use this hook somewhere in a react component if you just want to test a few lines of code
 * @param {function} fn
 */
const useTest = (fn) => useEffect(fn, []);

export default useTest;
