import View from "../View";
import p5, {HORIZ_ALIGN} from "p5";
import TextOverlay from "./TextOverlay";
import {TextStyle} from "./TextStyle";
import Align from "../Align";
import {drawDebugViewRect} from "../debug/drawDebugViewRect";
import {getValueSafe} from "../utils/getValueSafe";

const alphaStep = 25;
const maxAlpha = 200;

class TextView extends View {

    public title: string = ""
    public bgAlpha: number = 0
    public textSize: number = 30

    public color: [number, number, number, number] = [0, 0, 0, 0];
    public overlays: TextOverlay[] = []

    public textAlign: Align = Align.LEFT

    constructor(title: string)
    constructor(title: string, id: string)
    constructor(title: string,
                id: string,
                hoverHandler: (id: string, hovered: boolean, p: p5) => void,
                color: [number, number, number],
    )
    constructor(...args: any[]) {
        super()
        if (args.length === 1) {
            this.title = args[0];
        } else if (args.length === 2) {
            this.title = args[0];
            this.id = args[1];
        } else if (args.length === 3) {
            this.title = args[0];
            this.id = args[1];
            this.hoverHandler = args[2];
            this.color = [0, 0, 0, 255];
        } else {
            this.title = args[0];
            this.id = args[1];
            this.hoverHandler = args[2];
            this.color = args[3];
        }
    }

    setText(text: string): void {
        this.title = text
    }

    public setStyle(style: TextStyle) {
        this.color[0] = getValueSafe(style.color, 0, 0)
        this.color[1] = getValueSafe(style.color, 1, 0)
        this.color[2] = getValueSafe(style.color, 2, 0)
        this.color[3] = getValueSafe(style.color, 3, 255)
        this.textSize = style.fontSize
    }

    public contains(x: number, y: number, p: p5): boolean {
        const w = this.getWidth(p)
        const h = this.getHeight(p)
        const thisX = this.getX(p)
        const thisY = this.getY(p)
        return x >= thisX && x <= thisX + w && y >= thisY && y <= thisY + h
    }

    public render(p: p5) {
        super.render(p)

        if (!this.visible) return

        if (this.hover) this.bgAlpha = p.min(this.bgAlpha + alphaStep, maxAlpha);
        else this.bgAlpha = p.max(this.bgAlpha - alphaStep, 0);

        p.push()

        p.fill(this.color[0], this.color[1], this.color[2], this.alpha.calculate())
        p.textSize(this.textSize)
        p.textAlign(getTextAlign(p))
        p.text(
            this.title,
            this.getX(p) + this.padding,
            this.getY(p) + this.getHeight(p) - this.padding
        )
        p.pop()

        this.overlays.forEach((overlay) => {
            overlay.render(this, p)
        })

        drawDebugViewRect(this, p)
    }

    getWidth(p: p5): number {
        p.push()
        if (this.textSize != -1) p.textSize(this.textSize)
        let w = p.textWidth(this.title)
        p.pop()
        return w + this.padding * 2
    }

    getHeight(p: p5): number {

        /**
         * heightScale is a workaround to reduce space above the text.
         * Fits most single line cases
         */
        let heightScale = 1.5
        let h = this.getTextHeight(p)
        return (h + this.padding * 2) / heightScale
    }

    getTextHeight(p: p5): number {
        p.push()
        if (this.textSize != -1) p.textSize(this.textSize)
        let h = p.textAscent() + p.textDescent()
        p.pop()
        return h
    }

    public onHoverIn(p: p5) {
        super.onHoverIn(p);
        this.hover = true;
    }

    public onHoverOut(p: p5) {
        super.onHoverOut(p);
        this.hover = false;
    }
}

/**
 * Text align remains left always. We shift it accordingly in getX
 */
function getTextAlign(p: p5): HORIZ_ALIGN {
    return p.LEFT
}


export default TextView;
