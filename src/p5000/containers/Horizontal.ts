import p5 from 'p5';
import View from "../View";
import Align from "../Align"
import {handleChildrenClick, handleChildrenHover} from "../utils/viewUtils";
import {drawDebugViewRect} from "../debug/drawDebugViewRect";
import {Container} from "./Container";

export class Horizontal extends View implements Container {

    public alignContent: Align = Align.CENTER
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
        let maxH = 0;
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            maxH = Math.max(child.getHeight(p) + child.margin * 2, maxH)
        }
        return maxH;
    }

    getWidth(p: p5): number {
        let w = 0;
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            w += child.getWidth(p) + child.margin * 2
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

        let currentX = this.x;
        let maxMargin = this.getMaxMargin()

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const childWidth = child.getWidth(p);
            const xMargin = child.margin
            let y = 0
            if (this.alignContent === Align.TOP) {
                y = (this.y)
            } else if (this.alignContent == Align.CENTER) {
                const maxHeight = this.getHeight(p)
                y = (this.y + maxHeight - child.getHeight(p))
            } else if (this.alignContent == Align.BOTTOM) {
                const maxHeight = this.getHeight(p)
                y = (this.y + maxHeight / 2 - child.getHeight(p) / 2)
            } else {
                throw new Error("Unknown alignContent in Vertical: " + Align[this.alignContent])
            }


            child.setX(currentX + xMargin)
            child.setY(y - maxMargin)

            currentX += childWidth + xMargin * 2
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

    private getMaxMargin(): number {
        let m = 0;
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            m = Math.max(child.margin, m)
        }
        return m;
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
