import time from '../../constants/time';

export enum DateTimeZoneHandlingEnum {
    Default = 'default',
    Utc = 'utc',
    LocalOffset = 'localoffset'
}

export const DateTimeZoneHandling = {
    Default: 'default',
    Utc: 'utc',
    LocalOffset: 'localoffset'
};

export interface JsonSettings {
    ignoreNullValues?: boolean,
    includeUndefined?: boolean,
    includeNotSerializable?: boolean,
    excludeKeys?: string[],
    dateTimeZoneHandling?: typeof DateTimeZoneHandlingEnum | string
}

/**
 * Pass the return value of this function as second argument of JSON.stringify to customize the serialization
 * @param options
 */
export default function getJsonSettings(options: JsonSettings): (key: string, value: any) => any {
    const {
        ignoreNullValues = false,
        includeUndefined = false,
        includeNotSerializable = false,
        excludeKeys = [],
        dateTimeZoneHandling = DateTimeZoneHandling.Default
    } = options;
    return function replacer(key, val) {
        // if a value implements a toJSON() method like a Date, the value passed to this method is already stringified
        // @ts-expect-error
        const value = typeof this === 'object' ? this[key] : val;
        if (excludeKeys.includes(key)) {
            return undefined;
        }
        if (ignoreNullValues && value === null) {
            return undefined;
        }
        if (includeUndefined && value === undefined) {
            return null;
        }
        if (Array.isArray(value)) {
            return value.map((v: any): any => replacer(key, v));
        }
        if (dateTimeZoneHandling === DateTimeZoneHandling.LocalOffset
            && "[object Date]" === Object.prototype.toString.call(value)
        ) {
            const offset = new Date().getTimezoneOffset();
            const hourOffset = `00${Math.floor(Math.abs(offset) / 60)}`.slice(-2);
            const minuteOffset = `00${Math.floor(Math.abs(offset) % 60)}`.slice(-2);
            return `${new Date(value - offset * time.minute).toISOString()
                .replace(/Z$/, '')}${offset <= 0 ? '+' : '-'}${hourOffset}:${minuteOffset}`;
        }
        if (includeNotSerializable) {
            if (!(typeof (value) === 'number')
                && !(typeof (value) === 'string')
                && !(typeof (value) === 'boolean')
                && !chayns.utils.isObject(value)
                && "[object Date]" !== Object.prototype.toString.call(value)
                && value !== null
                && value !== undefined
            ) {
                return `${value}`;
            }
        }
        return value;
    };
}
