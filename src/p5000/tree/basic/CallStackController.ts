import {ResetStackInstruction, StackData, StackInstruction} from "./CallStack";
import {PlaybackFrame} from "../../playback/PlaybackTimelineView";

export class CallStackController {

    private stacks: Map<string, StackData> = new Map()
    private pointers: Map<string, number> = new Map() // stack-id -> cmd index
    private frameChangedListeners: ((instruction: StackInstruction, frame: StackData) => void)[] = []
    private visited = new Set() // visited instructions ids

    setFrames(frames: Map<string, StackData>) {
        this.stacks = frames

        this.resetPointers();
    }

    getCurrentFrame(): PlaybackFrame | null {
        return null
        //return this.currentFrame
    }

    selectNext() {

        let candidates: StackInstruction[] = []

        this.stacks.forEach((stack, id) => {
            let pointer = this.pointers.get(id)
            candidates.push(stack.instructions[pointer])
        })

        let minStart = Number.MAX_VALUE
        let nextInstruction: StackInstruction | null = null

        candidates.forEach((instruction) => {
            let start = instruction.start
            let id = instruction.id
            if (!this.visited.has(id) && start < minStart) {
                minStart = start
                nextInstruction = instruction
            }
        })

        if (nextInstruction !== null) {

            this.visited.add(nextInstruction.id)

            let stackId = nextInstruction.stackId;
            let stack = this.stacks.get(stackId);
            this.onFrameChanged(nextInstruction, stack)

            let pointer = this.pointers.get(stackId)
            pointer++

            if (pointer > stack.instructions.length - 1) {
                //ignore, current stack reached its end
            } else {
                this.pointers.set(stackId, pointer)
            }
        } else {

            if (this.isAllPointersAtEnd()) {
                this.resetPointers()
                this.sendResetStackInstruction()
            } else {
                console.warn("Not all pointers at end, but no next instruction found")
            }

        }
    }



    selectPrevious() {
        // this.currentFrame.forEach((frame, id) => {
        //     this.currentFrame[id] = frame - 1
        //
        //     if (this.currentFrame[id] < 0) {
        //         this.currentFrame[id] = this.stacks[id].length - 1
        //     }
        //
        //     this.onFrameChanged(id, this.stacks[id][this.currentFrame[id]])
        // })
    }

    addChangeListener(listener: (instruction: StackInstruction, frame: StackData) => void) {
        this.frameChangedListeners.push(listener)
    }

    private onFrameChanged(instruction: StackInstruction, stack: StackData) {
        this.frameChangedListeners.forEach(listener => {
            listener(instruction, stack)
        })
    }

    private resetPointers() {
        this.stacks.forEach((stack, id) => {
            this.pointers.set(id, 0)
        })
        this.visited.clear()
    }

    private sendResetStackInstruction() {
        this.stacks.forEach((stack, id) => {
            let reset = new ResetStackInstruction();
            reset.stackId = id
            this.onFrameChanged(reset, stack)
        })
    }

    private isAllPointersAtEnd() {
        let result = true
        this.stacks.forEach((stack, id) => {
            if (this.pointers.get(id) < stack.instructions.length - 1) {
                result = false
            }
        })
        return result
    }
}