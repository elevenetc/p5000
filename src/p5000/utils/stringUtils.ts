function dropLastChar(input: string): string {
    if (input.length === 0) return ""
    return input.slice(0, -1);
}

export {
    dropLastChar
}