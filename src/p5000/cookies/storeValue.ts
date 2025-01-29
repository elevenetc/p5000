export function storeValue(key: string, value: string) {
    document.cookie = key + "=" + encodeURIComponent(value) + "; path=/";
}

export function getValue(key: string): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.split('=').map(part => part.trim());
        if (cookieKey === key) {
            return cookieValue === undefined ? null : decodeURIComponent(cookieValue);
        }
    }
    return null;
}

export function storeNumber(key: string, value: number) {
    storeValue(key, value.toString());
}

export function getNumber(key: string): number | null {
    const value = getValue(key);
    if (value === null) return null;
    const num = parseFloat(value);
    if (isNaN(num)) throw new Error(`Value for key "${key}" is not a valid number`);
    return num;
}

export function getNumberOrDefault(key: string, defaultValue: number): number {
    const value = getValue(key);
    if (value === null) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
}

export function getValueOrDefault(key: string, defaultValue: string): string {
    const value = getValue(key);
    return value === null ? defaultValue : value;
}
