function jsonLog<T>(value: T): T;
function jsonLog<T>(value: T, maxLength: number): T | string;

function jsonLog<T>(value: T, maxLength?: number): T | string | unknown {
    try {
        const stringValue = JSON.stringify(value);
        if (maxLength && stringValue.length > maxLength) {
            return `${stringValue.substring(0, maxLength)}...`;
        }
        return JSON.parse(stringValue);
    } catch (ex) {
        return value;
    }
}

export default jsonLog;
