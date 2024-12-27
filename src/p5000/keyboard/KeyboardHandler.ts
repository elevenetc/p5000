interface KeyboardHandler {
    addListener(callback: (value: KeyValue) => void): void
}

class KeyboardHandlerImpl implements KeyboardHandler {

    private callbacks: ((value: KeyValue) => void)[] = []

    constructor() {
        document.addEventListener("keydown", (event) => {
            const value = eventKeyToKeyValue(event.key)
            if (value != null) {
                this.callbacks.forEach((callback) => {
                    callback(value)
                })
            }
        })
    }

    addListener(callback: (value: KeyValue) => void): void {
        this.callbacks.push(callback)
    }
}

function eventKeyToKeyValue(key: string): KeyValue | null {
    if (key == "Escape") {
        return new Escape()
    } else if (key == "Backspace") {
        return new Backspace()
    } else {
        const value = filterAlphanumericKey(key)
        if (value == null) return null
        else return new KeyChar(value)
    }
}

function filterAlphanumericKey(key: string): string | null {
    const alphanumericRegex = /^[a-zA-Z0-9]$/;
    return alphanumericRegex.test(key) ? key : null;
}

interface KeyValue {

}

class Backspace implements KeyValue {
}

class Escape implements KeyValue {
}

class KeyChar implements KeyValue {
    char: string

    constructor(char: string) {
        this.char = char
    }
}

export {
    KeyboardHandler,
    KeyboardHandlerImpl,
    KeyValue,
    Backspace,
    KeyChar,
    Escape
}