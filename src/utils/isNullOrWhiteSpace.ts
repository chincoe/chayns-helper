export default function isNullOrWhiteSpace(value: unknown): boolean {
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}
