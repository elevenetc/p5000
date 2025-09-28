export function errorOnNullOrUndefined(value: any) {
    if (value === null || value === undefined) {
        throw new Error("Value is null or undefined")
    }
}