function anyToString(any: Object): string {
    return JSON.stringify(any).replace(/"/g, "")
}

export {
    anyToString
}