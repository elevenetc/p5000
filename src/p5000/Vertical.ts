import p5 from 'p5';
import View from "./View";
import Align from "./Align"
import {handleChildrenHover} from "./utils/viewUtils";
import {drawDebugViewRect} from "./debug/drawDebugViewRect";
import {Container} from "./containers/Container";

class Vertical extends View implements Container {


    public alignContent: Align = Align.LEFT
    children: View[] = [];

    getChildren(): View[] {
        return this.children;
    }

    getChildX(child: View, p: p5): number {
        return this.x;
    }

    getChildY(child: View, p: p5): number {
        let index = indexOfChild(child, this.getChildren())
        return this.y + index * child.getHeight(p);
    }

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


    layout(p: p5) {
        super.layout(p)

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].layout(p)
        }

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
        }
    }

    public render(p: p5) {
        super.render(p)

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].render(p)
        }

        drawDebugViewRect(this, p)


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

function indexOfChild(child: View, children: View[]): number {
    const index = children.indexOf(child)
    if (index === -1) {
        throw new Error("Child not found in the provided children array.")
    }
    return index
}

function getChildY(parentY: number, childIndex: number, childHeight: number): number {
    return parentY + childIndex * childHeight
}

export default Vertical;
