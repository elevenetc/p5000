import {Stack} from "../../utils/Stack";
import {NodeView} from "./TreeModel";

export class CallStack {
    stack = new Stack<NodeView>()
    map = new Map<string, NodeView>();

    clear() {
        this.stack.clear()
        this.map.clear()
    }

    push(view: NodeView) {
        this.stack.push(view)
        this.map.set(view.id, view)
    }

    pop(): NodeView | undefined {
        this.map.delete(this.stack.peek()?.id)
        return this.stack.pop()
    }

    contains(view: NodeView): boolean {
        return this.map.has(view.id)
    }

    forEach(callback: (view: NodeView) => void) {
        this.map.forEach(callback)
    }

    getSize(): number {
        return this.map.size
    }

    isEmpty(): boolean {
        return this.map.size === 0
    }

    peek() {
        return this.stack.peek()
    }
}
