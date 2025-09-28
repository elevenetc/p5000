export function mapValues<T, R>(map: Map<any, T>, transform: (value: T) => R): R[] {
    const values: R[] = []
    map.forEach((value) => {
        values.push(transform(value))
    })
    return values
}