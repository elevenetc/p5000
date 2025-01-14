class Queue<T> {
    private items: T[] = [];

    // Add an element to the end of the queue
    enqueue(item: T): void {
        this.items.push(item);
    }

    // Remove and return the element from the front of the queue
    dequeue(): T | undefined {
        return this.items.shift();
    }

    // Peek the element at the front of the queue without removing it
    peek(): T | undefined {
        return this.items[0];
    }

    // Check if the queue is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Get the size of the queue
    size(): number {
        return this.items.length;
    }

    isNotEmpty(): boolean {
        return !this.isEmpty()
    }
}

export {
    Queue,
}