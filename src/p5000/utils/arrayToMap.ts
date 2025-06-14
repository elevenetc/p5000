export function arrayToMap<T>(
    array: T[],
    getKey: (item: T) => string
): Map<string, T> {
    const map = new Map<string, T>();
    for (const item of array) {
        map.set(getKey(item), item);
    }
    return map;
}