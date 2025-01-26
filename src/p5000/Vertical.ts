import p5 from 'p5';
import View from "./View";
import Align from "./Align"
import {handleChildrenClick, handleChildrenHover} from "./utils/viewUtils";
import {drawDebugViewRect} from "./debug/drawDebugViewRect";
import {Container} from "./containers/Container";

class Vertical extends View implements Container {


    public alignContent: Align = Align.LEFT
    children: View[] = [];


    constructor() {
        super();
        this.clickable = true
    }

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

        let currentY = this.y;

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const childHeight = child.getHeight(p);
            if (this.alignContent === Align.LEFT) {
                child.setX(this.x)
            } else if (this.alignContent == Align.RIGHT) {
                const maxChildWidth = this.getWidth(p)
                child.setX(this.x + maxChildWidth - child.getWidth(p))
            } else if (this.alignContent == Align.CENTER) {
                const maxChildWidth = this.getWidth(p)
                child.setX(this.x + maxChildWidth / 2 - child.getWidth(p) / 2)
            } else {
                throw new Error("Unknown alignContent in Vertical: " + Align[this.alignContent])
            }

            child.setY(currentY)

            currentY += childHeight
        }
    }

    public render(p: p5) {
        super.render(p)

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].render(p)
        }

        drawDebugViewRect(this, p)
    }

    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        return handleChildrenHover(this.children, mouseX, mouseY, p)
    }

    handleClick(mouseX: number, mouseY: number, p: p5): boolean {
        return handleChildrenClick(this.children, mouseX, mouseY, p)
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
