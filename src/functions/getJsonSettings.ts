import time from '../constants/time';

export enum DateTimeZoneHandling {
    Default = 'default',
    Utc = 'utc',
    LocalOffset = 'localoffset'
}

export interface JsonSettings {
    ignoreNullValues?: boolean;
    includeUndefined?: boolean;
    includeNotSerializable?: boolean;
    excludeKeys?: string[];
    dateTimeZoneHandling?: DateTimeZoneHandling | string;
}

/**
 * Pass the return value of this function as second argument of JSON.stringify to customize the serialization
 * @param options
 */
export default function getJsonSettings(options: JsonSettings): (
    this: unknown,
    key: string,
    value: unknown
) => unknown {
    const {
        ignoreNullValues = false,
        includeUndefined = false,
        includeNotSerializable = false,
        excludeKeys = [],
        dateTimeZoneHandling = DateTimeZoneHandling.Default
    } = options;
    return function replacer(this: unknown, key, val): unknown {
        // if a value implements a toJSON() method like a Date, the value passed to this method is already stringified
        const value = key && typeof this === 'object' ? (this as Record<string, unknown>)[key] : val;
        if (excludeKeys.includes(key)) {
            return undefined;
        }
        if (ignoreNullValues && value === null) {
            return undefined;
        }
        if (includeUndefined && value === undefined) {
            return null;
        }
        if (dateTimeZoneHandling === DateTimeZoneHandling.LocalOffset
            && Object.prototype.toString.call(value) === '[object Date]'
        ) {
            const offset = new Date().getTimezoneOffset();
            const hourOffset = `00${Math.floor(Math.abs(offset) / 60)}`.slice(-2);
            const minuteOffset = `00${Math.floor(Math.abs(offset) % 60)}`.slice(-2);
            return `${new Date((value as Date).getTime() - offset * time.minute).toISOString()
                .replace(/Z$/, '')}${offset <= 0 ? '+' : '-'}${hourOffset}:${minuteOffset}`;
        }
        if (includeNotSerializable) {
            if (!(typeof (value) === 'number')
                && !(typeof (value) === 'string')
                && !(typeof (value) === 'boolean')
                && Object.prototype.toString.call(value) !== '[object Array]'
                && Object.prototype.toString.call(value) !== '[object Object]'
                && Object.prototype.toString.call(value) !== '[object Date]'
                && value !== null
                && value !== undefined
            ) {
                return `${value}`;
            }
        }
        if (value && (value as Date)?.toJSON && typeof (value as Date).toJSON === 'function') {
            return (value as Date).toJSON();
        }
        return value;
    };
}
