// eslint-disable-next-line import/no-mutable-exports
let useSelector = () => {
    console.error('[chayns-helper] Please install react-redux to use selector hooks.');
};

try {
    // eslint-disable-next-line global-require
    useSelector = require('react-redux')?.useSelector;
} catch (e) { /* ignored */ }

export default useSelector;
