// @ts-expect-error no types available
const isChromeBased = !!window.chrome;
// @ts-expect-error no types available
const isFirefox = typeof InstallTrigger !== 'undefined';

// eslint-disable-next-line no-console
export function createColorLog(elements: Record<string, string>): string[] {
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

export interface ColorLog {
    create: (elements: Record<string, string>) => string[];
    gray: (v: string) => string[];
    color: (color: string, v: string) => string[];
}

const colorLog: ColorLog = {
    create: createColorLog,
    gray: (v: string) => createColorLog({ [v]: 'color:#aaaaaa' }),
    color: (color: string, v: string) => createColorLog({ [v]: `color:${color}` })
};

export default colorLog;
