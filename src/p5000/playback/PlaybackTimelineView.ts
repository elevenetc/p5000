import View from "../View";
import p5 from "p5";

class PlaybackTimelineView extends View {

    private frames: PlaybackFrame[] = []
    private selected = 0

    selectNext() {
        this.selected++
        if (this.selected > this.frames.length - 1) {
            this.selected = 0
        }
    }

    selectPrevious() {
        this.selected--;
        if (this.selected < 0) {
            this.selected = this.frames.length - 1;
        }
    }

    getCurrentFrame(): PlaybackFrame {
        return this.frames[this.selected];
    }

    getWidth(p: p5): number {
        return 400
    }

    getHeight(p: p5): number {
        return 50
    }

    setFrames(frames: PlaybackFrame[]) {
        this.frames = frames
    }

    render(p: p5) {
        if (!this.visible) return
        super.render(p);
        p.push()
        if (this.frames.length === 0) {
            this.drawNoFrames(p)
        } else {
            this.drawFrames(p)
        }
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

        let frameWidth = this.getWidth(p) / this.frames.length
        let x = this.getX(p)
        let y = this.getY(p)
        let height = this.getHeight(p)
        p.stroke("rgb(255,255,255,255)")
        let id = 0
        this.frames.forEach(frame => {
            this.drawFrame(x, y, height, frameWidth, id, frame, p);
            x += frameWidth
            id++
        })
    }

    private drawFrame(
        x: number, y: number,
        height: number, frameWidth: number,
        id: number, frame: PlaybackFrame, p: p5) {

        p.line(x, y, x, y + height)

        if (id == this.selected) {
            p.fill("#rgb(0,255,10)")
            p.rect(x, y, frameWidth, height)
        }
    }
}

class PlaybackFrame {
    id: string = ""
    name: string = ""
}

export {
    PlaybackTimelineView, PlaybackFrame
}