import time from '../constants/time';

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
    dateTimeZoneHandling?: DateTimeZoneHandlingEnum
}

export default function getJsonSettings(options: JsonSettings): (key: string, value: any) => any {
    const {
        ignoreNullValues = false,
        includeUndefined = false,
        includeNotSerializable = false,
        excludeKeys = [],
        dateTimeZoneHandling = DateTimeZoneHandling.Default
    } = options;
    return function replacer(key, value) {
        if (excludeKeys.includes(key)) {
            return undefined;
        }
        if (ignoreNullValues && value === null) {
            return undefined;
        }
        if (includeUndefined && value === undefined) {
            return typeof (includeUndefined) === 'boolean'
                ? null
                : includeUndefined;
        }
        if (Array.isArray(value)) {
            return value.map((v: any): any => replacer(key, v));
        }
        if (dateTimeZoneHandling === DateTimeZoneHandling.LocalOffset && chayns.utils.isDate(value)) {
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
                && !chayns.utils.isDate(value)
                && value !== null
                && value !== undefined
            ) {
                return `${value}`;
            }
        }
        return value;
    };
}
