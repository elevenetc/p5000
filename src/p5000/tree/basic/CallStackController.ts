import {ResetStackInstruction, StackData, StackInstruction} from "./CallStack";
import {PlaybackFrame} from "../../playback/PlaybackTimelineView";

export class CallStackController {

    private stacks: Map<string, StackData> = new Map()
    private pointers: Map<string, number> = new Map() // stack-id -> cmd index
    private frameChangedListeners: ((instruction: StackInstruction, frame: StackData) => void)[] = []

    //private currentStacks: Map<string, StackData> = new Map()
    //private currentFrame: PlaybackFrame | null = null

    setFrames(frames: Map<string, StackData>) {
        this.stacks = frames

        this.stacks.forEach((stack, id) => {
            this.pointers.set(id, 0)
        })

        //this.currentStacks = this.cloneFrames(this.stacks)
    }

    getCurrentFrame(): PlaybackFrame | null {
        return null
        //return this.currentFrame
    }

    selectNext() {

        this.stacks.forEach((stack, id) => {
            let pointer = this.pointers.get(id)

            if (pointer > stack.instructions.length - 1) {
                this.pointers.set(id, 0)
                this.onFrameChanged(new ResetStackInstruction(), stack)
            } else {
                let instruction = stack.instructions[pointer]
                this.onFrameChanged(instruction, stack)
                pointer++
                this.pointers.set(id, pointer)
            }
        })
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
}