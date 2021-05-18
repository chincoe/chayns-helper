import getJsonSettings, { DateTimeZoneHandling } from '../../src/functions/getJsonSettings';

describe('functions/getJsonSettings', () => {
    const foo = {
        a: 1,
        b: 'hello world',
        c: null,
        d: undefined,
        e: new Date(0),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        f: () => {},
        g: [1, 2, 3]
    };
    it('runs without crashing', () => {
        JSON.stringify(foo, getJsonSettings({}));
        JSON.stringify(foo, getJsonSettings({
            dateTimeZoneHandling: DateTimeZoneHandling.LocalOffset,
            excludeKeys: ['b'],
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
            dateTimeZoneHandling: DateTimeZoneHandling.LocalOffset,
            excludeKeys: ['b'],
            ignoreNullValues: true,
            includeNotSerializable: true,
            includeUndefined: true
        }))).toMatch(
            /{"a":1,"d":null,"e":"1970-01-01T([0-9]+):00:00.000\+\1:00","f":"function \(\) { }","g":\[1,2,3]}/
        );
    });
});
