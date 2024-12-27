import View from "../View";
import p5 from "p5";
import TextOverlay from "./TextOverlay";

const alphaStep = 25;
const maxAlpha = 200;

class TextView extends View {

    public title: string;
    public bgAlpha: number = 0
    public textSize: number = -1

    public color: [number, number, number] = [0, 0, 0];
    public overlays: TextOverlay[] = []

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

        if (this.hover) this.bgAlpha = p.min(this.bgAlpha + alphaStep, maxAlpha);
        else this.bgAlpha = p.max(this.bgAlpha - alphaStep, 0);

        p.fill(this.color[0], this.color[1], this.color[2], this.alpha.calculate());

        const prevTextSize = p.textSize()

        if (this.textSize != -1) {
            p.textSize(this.textSize)
        }
        p.text(this.title, this.x, this.y + this.getHeight(p));
        p.textSize(prevTextSize)

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


export default TextView;
