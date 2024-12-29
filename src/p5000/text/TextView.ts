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

    public contains(x: number, mouseY: number, p: p5): boolean {
        const w = this.getWidth(p);
        const h = this.getHeight(p);
        const thisX = this.getX(p)
        const thisY = this.getY(p)
        return x >= thisX && x <= thisX + w &&
            mouseY >= thisY && mouseY <= thisY + h;
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
        p.textAlign(toP5Align(this.textAlign, p))
        p.text(this.title, getX(this, p), this.y + this.getHeight(p));
        p.textSize(prevTextSize)

        p.pop()

        this.overlays.forEach((overlay) => {
            overlay.render(this, p)
        })
    }

    getWidth(p: p5): number {
        return p.textWidth(this.title);
    }

    getHeight(p: p5): number {
        return p.textAscent() + p.textDescent();
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
    let parentX = view.parent?.getX(p) ?? view.getX(p)
    let parentWidth = view.parent?.getWidth(p) ?? view.getWidth(p)
    if (view.textAlign == Align.LEFT) {
        return parentX
    } else if (view.textAlign == Align.RIGHT) {
        return parentX + parentWidth
    } else if (view.textAlign == Align.CENTER) {
        return view.getX(p) + view.getWidth(p) / 2
    } else {
        throw new Error(`TextView: Unsupported textAlign ${Align[view.textAlign]}`)
    }
}

function toP5Align(align: Align, p: p5): HORIZ_ALIGN {
    if (align == Align.LEFT) {
        return p.LEFT
    } else if (align == Align.RIGHT) {
        return p.RIGHT
    } else if (align == Align.CENTER) {
        return p.CENTER
    } else {
        throw new Error(`Unsupported text align: ${Align[align]}`)
    }
}


export default TextView;
