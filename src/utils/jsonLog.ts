export default function jsonLog(value: any, maxLength?: number) {
    try {
        const stringValue = JSON.stringify(value);
        if (maxLength && stringValue.length > maxLength) {
            return stringValue.substring(0, maxLength) + '...';
        }
        return JSON.parse(stringValue)
    } catch (ex) {
        return value;
    }
}
