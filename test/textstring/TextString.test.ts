// @ts-expect-error
import * as chaynsComponents from 'chayns-components';
import getTextStrings from '../../src/textstring/getTextStrings';

let getTextString: (
    stringName: string,
    language?: string | 'de' | 'en',
    fallback?: string
) => string;

const testStrings: Record<string, string> = {
    'txt_test_1_de': 'Test 1 de',
    'txt_test_2_de': 'Test 2 de',
    'txt_test_3_de': 'Test 3 de',
    'txt_test_1_en': 'Test 1 en',
    'txt_test_2_en': 'Test 2 en',
    'txt_test_3_en': 'Test 3 en'
}

describe('textstring/TextString', () => {
    beforeAll(() => {
        getTextString = chaynsComponents.TextString.getTextString;
        chaynsComponents.TextString.getTextString = (
            stringName: string,
            language: string | 'de' | 'en' = 'de',
            fallback: string = ''
        ) => {
            return testStrings[`${stringName}_${language}`] || fallback
        }
    })

    describe('textstring/getTextStrings', () => {
        it('runs without crashing', () => {
            getTextStrings('txt_test_1', 'test 1');
            getTextStrings(['txt_test_1', 'txt_test_2']);
            getTextStrings({ 'txt_test_1': 'test 1', 'txt_test_2': 'test 2' });
        })

        it('works with the first overload', () => {
            expect(getTextStrings('txt_test_1', 'test 1')).toBe('Test 1 de');
            expect(getTextStrings('txt_test_1', 'test 1', 'en')).toBe('Test 1 en');
            expect(getTextStrings('txt_test', 'test 1')).toBe('test 1');
        })

        it('works with the second overload', () => {
            const result1 = getTextStrings(['txt_test_1']);
            const result2 = getTextStrings(['txt_test_2'], 'en');
            const result3 = getTextStrings(['txt_test']);

            const [str1] = result1;
            const { txt_test_1 } = result1;
            expect(str1).toBe('Test 1 de');
            expect(txt_test_1).toBe('Test 1 de');

            const [str2] = result2;
            const { txt_test_2 } = result2;
            expect(str2).toBe('Test 2 en');
            expect(txt_test_2).toBe('Test 2 en');

            const [str3] = result3;
            const { txt_test_3 } = result3;
            expect(str3).toBeUndefined();
            expect(txt_test_3).toBeUndefined();
        })

        it('works with the third overload', () => {
            const result1 = getTextStrings({ txt_test_1: 'test 1' });
            const result2 = getTextStrings({ txt_test_2: 'test 2' }, 'en');
            const result3 = getTextStrings({ txt_test: 'test 1' });
            const { txt_test_1 } = result1;
            expect(txt_test_1).toBe('Test 1 de');
            const { txt_test_2 } = result2;
            expect(txt_test_2).toBe('Test 2 en');
            const { txt_test } = result3;
            expect(txt_test).toBe('test 1');
        })
    })

    afterAll(() => {
        chaynsComponents.TextString.getTextString = getTextString;
    })
})
