// @ts-expect-error
const isChromeBased = !!window.chrome;
// @ts-expect-error
const isFirefox = typeof InstallTrigger !== 'undefined';
// eslint-disable-next-line no-console
export default function colorLog(elements: {[message: string]: string}): string[] {
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
