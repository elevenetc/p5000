import View from "../View";
import p5, {HORIZ_ALIGN} from "p5";
import TextOverlay from "./TextOverlay";
import {TextStyle} from "./TextStyle";
import Align from "../Align";

const alphaStep = 25;
const maxAlpha = 200;

class TextView extends View {

    public title: string;
    public bgAlpha: number = 0
    public textSize: number = -1

    public color: [number, number, number] = [0, 0, 0];
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
            this.color = [0, 0, 0];
        } else {
            this.title = args[0];
            this.id = args[1];
            this.hoverHandler = args[2];
            this.color = args[3];
        }
    }

    public setStyle(style: TextStyle) {
        this.color[0] = style.color[0]
        this.color[1] = style.color[1]
        this.color[2] = style.color[2]
        this.textSize = style.fontSize
    }

    public contains(x: number, y: number, p: p5): boolean {
        const w = this.getWidth(p)
        const h = this.getHeight(p)
        const thisX = getX(this, p)
        const thisY = this.getY(p)
        return x >= thisX && x <= thisX + w && y >= thisY && y <= thisY + h
    }

    public render(p: p5) {
        super.render(p)
        //debug
        // if (this.bgAlpha > 0) {
        //   p.noStroke()
        //   p.fill(200, this.bgAlpha)
        //   p.rect(this.x, this.y, this.getWidth(p), this.getHeight(p))
        // }

        if (!this.visible) return

        if (this.hover) this.bgAlpha = p.min(this.bgAlpha + alphaStep, maxAlpha);
        else this.bgAlpha = p.max(this.bgAlpha - alphaStep, 0);

        p.push()

        p.fill(this.color[0], this.color[1], this.color[2], this.alpha.calculate());

        const prevTextSize = p.textSize()

        if (this.textSize != -1) {
            p.textSize(this.textSize)
        }
        p.textAlign(getTextAlign(p))
        p.text(this.title, getX(this, p), this.y + this.getHeight(p));
        p.textSize(prevTextSize)

        p.pop()

        this.overlays.forEach((overlay) => {
            overlay.render(this, p)
        })
    }

    getWidth(p: p5): number {
        p.push()
        if (this.textSize != -1) p.textSize(this.textSize)
        let w = p.textWidth(this.title)
        p.pop()
        return w
    }

    getHeight(p: p5): number {
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

function getX(view: TextView, p: p5): number {
    let parentX = view.parent?.getX(p) ?? 0
    let viewWidth = view.getWidth(p);
    let parentWidth = view.parent?.getWidth(p) ?? 0
    if (view.textAlign == Align.LEFT) {
        return parentX
    } else if (view.textAlign == Align.RIGHT) {
        return parentX + parentWidth - viewWidth
    } else if (view.textAlign == Align.CENTER) {
        return parentX + parentWidth / 2 - viewWidth / 2
    } else {
        throw new Error(`TextView: Unsupported textAlign ${Align[view.textAlign]}`)
    }
}

/**
 * Text align remains left always. We shift it accordingly in getX
 */
function getTextAlign(p: p5): HORIZ_ALIGN {
    return p.LEFT
}


export default TextView;
