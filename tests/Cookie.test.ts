import {
    getNumber,
    getNumberOrDefault,
    getValue,
    getValueOrDefault,
    storeNumber,
    storeValue
} from '../src/p5000/cookies/storeValue';

describe('Cookie functions', () => {
    beforeEach(() => {
        // Clear cookies before each test
        document.cookie.split(';').forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
    });

    test('should store and retrieve simple value', () => {
        storeValue('testKey', 'testValue');
        expect(getValue('testKey')).toBe('testValue');
    });

    test('should store and retrieve value with special characters', () => {
        const specialValue = 'test@Value with spaces & symbols!';
        storeValue('testKey', specialValue);
        expect(getValue('testKey')).toBe(specialValue);
    });

    test('should return null for non-existent cookie', () => {
        expect(getValue('nonExistentKey')).toBeNull();
    });

    test('should handle empty value', () => {
        storeValue('emptyKey', '');
        expect(getValue('emptyKey')).toBe('');
    });

    test('should store and retrieve integer number', () => {
        storeNumber('numKey', 42);
        expect(getNumber('numKey')).toBe(42);
    });

    test('should store and retrieve floating-point number', () => {
        storeNumber('floatKey', 3.14159);
        expect(getNumber('floatKey')).toBe(3.14159);
    });

    test('should return null for non-existent number', () => {
        expect(getNumber('nonExistentNumber')).toBeNull();
    });

    test('should throw error when retrieving invalid number', () => {
        storeValue('invalidNumber', 'not-a-number');
        expect(() => getNumber('invalidNumber')).toThrow('Value for key "invalidNumber" is not a valid number');
    });

    test('should return default value for non-existent number', () => {
        expect(getNumberOrDefault('nonExistentNumber', 42)).toBe(42);
    });

    test('should return default value for invalid number', () => {
        storeValue('invalidNumber', 'not-a-number');
        expect(getNumberOrDefault('invalidNumber', 42)).toBe(42);
    });

    test('should return stored value when valid number exists', () => {
        storeNumber('validNumber', 123.45);
        expect(getNumberOrDefault('validNumber', 42)).toBe(123.45);
    });

    test('should return default value for non-existent string', () => {
        expect(getValueOrDefault('nonExistentKey', 'default')).toBe('default');
    });

    test('should return stored value when string exists', () => {
        storeValue('existingKey', 'stored value');
        expect(getValueOrDefault('existingKey', 'default')).toBe('stored value');
    });
});
