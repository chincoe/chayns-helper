export default function jsonLog(value: any, maxLength?: number) {
    try {
        const stringValue = JSON.stringify(value, null, 2);
        if (maxLength && stringValue.length > maxLength) {
            return JSON.stringify(value, null, 2).substring(0, maxLength) + '...';
        }
        return JSON.parse(stringValue)
    } catch (ex) {
        return value;
    }
}
