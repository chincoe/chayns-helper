/**
 * A helper to extract the useSelector hook from react-redux and catch the error if that package is not installed
 */
// eslint-disable-next-line import/no-mutable-exports,@typescript-eslint/no-explicit-any
let useSelector = (): any => {
    console.error('[chayns-helper] Please install react-redux to use selector hooks.');
};

try {
    // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires
    useSelector = require('react-redux/es/hooks/useSelector')?.useSelector;
} catch (e) {
    /* ignored */
}

export default useSelector;
