export class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        if (this.items.length === 0) throw new Error("Stack is empty, cannot pop")
        return this.items.pop();
    }

    peek(): T | undefined {
        if (this.items.length === 0) throw new Error("Stack is empty, cannot peek")
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }

    clone(): Stack<T> {
        const clone = new Stack<T>();
        clone.items = this.items.slice();
        return clone;
    }
}