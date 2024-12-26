import p5 from 'p5';
import View from "./View";
import Align from "./Align"
import {handleChildrenHover} from "./utils/viewUtils";

class Vertical extends View {

    public alignContent: Align = Align.LEFT
    children: View[] = [];

    getHeight(p: p5): number {
        let h = 0;
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            h += child.getHeight(p)
        }
        return h;
    }

    getWidth(p: p5): number {
        let w = 0;
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            w = Math.max(child.getWidth(p), w)
        }
        return w;
    }

    public addChild(child: View) {
        this.children.push(child);
        child.parent = this;
    }

    public contains(x: number, y: number, p: p5): boolean {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child.contains(x, y, p)) {
                return true
            }
        }
        return false;
    }

    public render(p: p5) {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const y = this.y + i * child.getHeight(p);
            if (this.alignContent === Align.LEFT) {
                child.setX(this.x)
                child.setY(y)
            } else if (this.alignContent == Align.RIGHT) {
                const maxChildWidth = this.getWidth(p)
                child.setX(this.x + maxChildWidth - child.getWidth(p))
                child.setY(y)
            } else {
                throw new Error("Unknown alignContent: " + this.alignContent)
            }
            child.render(p);
        }


        //debug
        //let c: p5.Color;
        //c = p.color(0, 204, 0, 30)
        //p.fill(c);
        //p.rect(this.x, this.y, this.getWidth(p), this.getHeight(p));
    }

    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        return handleChildrenHover(this.children, mouseX, mouseY, p)
    }

    public onHoverIn(p: p5) {

    }

    public onHoverOut(p: p5) {

    }
}

export default Vertical;
