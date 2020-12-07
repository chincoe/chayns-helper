
export default function getJsonSettings(options: {
    ignoreNullValues?: boolean,
    includeUndefined?: boolean,
    includeNotSerializable?: boolean,
    excludeKeys?: string[]
}): (key: string, value: any) => any {
    const {
        ignoreNullValues = false,
        includeUndefined = false,
        includeNotSerializable = false,
        excludeKeys = []
    } = options;
    return function replacer(key, value) {
        if (excludeKeys.includes(key)) {
            return undefined;
        }
        if (ignoreNullValues && value === null) {
            return undefined;
        }
        if (includeUndefined && value === undefined) {
            return chayns.utils.isBoolean(includeUndefined)
                   ? null
                   : includeUndefined;
        }
        if (chayns.utils.isArray(value)) {
            return value.map((v: any) => replacer(key, v));
        }
        if (includeNotSerializable) {
            if (!chayns.utils.isNumber(value)
                && !chayns.utils.isString(value)
                && !chayns.utils.isBoolean(value)
                && !chayns.utils.isObject(value)
                && value !== null
                && value !== undefined
            ) {
                return `${value}`;
            }
        }
        return value;
    };
}
