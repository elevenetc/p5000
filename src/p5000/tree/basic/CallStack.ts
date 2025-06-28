import {Stack} from "../../utils/Stack";
import {NodeView} from "./TreeModel";

export class CallStack {
    stack = new Stack<NodeView>()
    map = new Map<string, NodeView>();

    reset() {
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

export class StackData {
    id: string = ""
    instructions: StackInstruction[]
    //frames = new Stack<PlaybackFrame>()
}

export class StackInstruction {
    id: string
    stackId: string
    start: number
    end: number
}

export class PushStackInstruction extends StackInstruction {
    nodeId: string

    constructor(nodeId: string) {
        super()
        this.nodeId = nodeId
    }
}

export class PopStackInstruction extends StackInstruction {
}

export class ResetStackInstruction extends StackInstruction {
}