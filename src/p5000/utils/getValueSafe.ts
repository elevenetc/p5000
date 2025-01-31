export const getValueSafe = <T>(arr: T[], index: number, defaultValue?: T): T => {
    if (index >= 0 && index < arr.length) {
        return arr[index];
    }
    return defaultValue as T
};
