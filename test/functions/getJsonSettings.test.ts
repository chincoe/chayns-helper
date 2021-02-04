import getJsonSettings, { DateTimeZoneHandlingEnum } from '../../src/functions/getJsonSettings/getJsonSettings';

describe('functions/getJsonSettings', () => {
    const foo = {
        a: 1,
        b: "hello world",
        c: null,
        d: undefined,
        e: new Date(0),
        f: console.log
    }
    it('runs without crashing', () => {
        JSON.stringify(foo, getJsonSettings({}));
        JSON.stringify(foo, getJsonSettings({
            dateTimeZoneHandling: DateTimeZoneHandlingEnum.LocalOffset,
            excludeKeys: ["b"],
            ignoreNullValues: true,
            includeNotSerializable: true,
            includeUndefined: true
        }));
    });
    it('does not modify without options', () => {
        expect(JSON.stringify(foo, getJsonSettings({}))).toMatch(JSON.stringify(foo));
    });
    it('calculates the right values', () => {
        expect(JSON.stringify(foo, getJsonSettings({
            dateTimeZoneHandling: DateTimeZoneHandlingEnum.LocalOffset,
            excludeKeys: ["b"],
            ignoreNullValues: true,
            includeNotSerializable: true,
            includeUndefined: true
        }))).toMatch(`{"a":1,"d":null,"e":"1970-01-01T01:00:00.000+01:00","f":"function () { [native code] }"}`)
    })
})
