export function printCurrentMethod() {
    console.log("call: " + getCurrentMethodName())
}

function getCurrentMethodName(): string {
    const err = new Error();
    const stack = err.stack?.split('\n');
    if (stack && stack.length >= 3) {
        const match = stack[3].match(/at\s+([^\s(]+)/);
        if (match) return match[1];
    }
    return "unknown";
}