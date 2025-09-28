import View from "../View";
import p5 from "p5";

class PlaybackTimelineView extends View {

    //private frames: Map<string, PlaybackFrame[]> = new Map()
    //private currentFrame: Map<string, number> = new Map()

    // selectNext() {
    //     // this.selected++
    //     // if (this.selected > this.frames.length - 1) {
    //     //     this.selected = 0
    //     // }
    // }
    //
    // selectPrevious() {
    //     // this.selected--;
    //     // if (this.selected < 0) {
    //     //     this.selected = this.frames.length - 1;
    //     // }
    // }

    // getCurrentFrame(): PlaybackFrame {
    //     //return this.frames[this.selected];
    //     return null
    // }

    getWidth(p: p5): number {
        return 400
    }

    getHeight(p: p5): number {
        return 50
    }

    setFrames(frames: Map<string, PlaybackFrame[]>) {
        //this.frames = frames
    }

    render(p: p5) {
        if (!this.visible) return
        super.render(p);
        p.push()
        // if (this.frames.length === 0) {
        //     this.drawNoFrames(p)
        // } else {
        //     this.drawFrames(p)
        // }
        p.pop()
    }

    private drawNoFrames(p: p5) {
        let x = this.getX(p)
        let y = this.getY(p)
        let w = this.getWidth(p)
        let h = this.getHeight(p)

        p.text("No frames", x + w / 2, y + h / 2)
    }

    private drawFrames(p: p5) {

        // let frameWidth = this.getWidth(p) / this.frames.length
        // let x = this.getX(p)
        // let y = this.getY(p)
        // let height = this.getHeight(p)
        // p.stroke("rgb(255,255,255,255)")
        // let id = 0
        // this.frames.forEach(frame => {
        //     this.drawFrame(x, y, height, frameWidth, id, frame, p);
        //     x += frameWidth
        //     id++
        // })
    }

    private drawFrame(
        x: number, y: number,
        height: number, frameWidth: number,
        id: number, frame: PlaybackFrame, p: p5) {

        // p.line(x, y, x, y + height)
        //
        // if (id == this.selected) {
        //     p.fill("#rgb(0,255,10)")
        //     p.rect(x, y, frameWidth, height)
        // }
    }
}

class PlaybackFrame {
    id: string = ""
    nodeId: string = ""
    name: string = ""
    index: number = -1

    start: number = -1
    end: number = -1
}

export {
    PlaybackTimelineView, PlaybackFrame
}