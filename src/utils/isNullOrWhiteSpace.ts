export default function isNullOrWhiteSpace(value: any): boolean {
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}
