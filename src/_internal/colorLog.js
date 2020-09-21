const isChromeBased = !!window.chrome;
const isFirefox = typeof InstallTrigger !== 'undefined';
/**
 * @param {Object.<string, string>} elements
 * @returns {string[]}
 */
// eslint-disable-next-line no-console
export default function colorLog(elements) {
    if (!isChromeBased && !isFirefox) return [Object.keys(elements).join(' ')];
    const logs = [];
    const styles = [];
    const keys = Object.keys(elements);
    for (let i = 0; i < keys.length; i++) {
        logs.push(`%c${keys[i]}`);
        styles.push(elements[keys[i]]);
    }
    // eslint-disable-next-line no-console
    return [logs.join(' '), ...styles];
}
