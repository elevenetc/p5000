import {Queue} from "../src/p5000/utils/Queue";

describe('Queue', () => {
    let queue: Queue<number>;

    beforeEach(() => {
        queue = new Queue<number>();
    });

    test('should enqueue elements', () => {
        queue.enqueue(1);
        queue.enqueue(2);
        expect(queue.size()).toBe(2);
    });

    test('should dequeue elements in FIFO order', () => {
        queue.enqueue(1);
        queue.enqueue(2);
        expect(queue.dequeue()).toBe(1);
        expect(queue.dequeue()).toBe(2);
    });

    test('should peek the front element without removing it', () => {
        queue.enqueue(1);
        expect(queue.peek()).toBe(1);
        expect(queue.size()).toBe(1);
    });

    test('should check if the queue is empty', () => {
        expect(queue.isEmpty()).toBe(true);
        queue.enqueue(1);
        expect(queue.isEmpty()).toBe(false);
    });

    test('should check if the queue is not empty', () => {
        expect(queue.isNotEmpty()).toBe(false);
        queue.enqueue(1);
        expect(queue.isNotEmpty()).toBe(true);
    });
});