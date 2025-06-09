import p5 from 'p5';
import View from "../View";
import Align from "../Align"
import {handleChildrenClick, handleChildrenHover} from "../utils/viewUtils";
import {Container} from "./Container";
import {P5000Config} from "../initP5000";

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

        if (this.cacheState.height == -1) {
            let h = 0;
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                h += child.getHeight(p)
            }
            this.cacheState.height = h;
        }

        return this.cacheState.height
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
        this.cacheState.height = -1
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

    init(p: p5, config: P5000Config) {
        super.init(p, config);
        this.children.forEach(child => {
            child.init(p, config)
        })
    }

    layout(p: p5) {
        super.layout(p)

        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            child.layout(p)
        }

        let currentY = this.getY(p);

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const childHeight = child.getHeight(p);
            if (this.alignContent === Align.LEFT) {
                child.setX(this.getX(p))
            } else if (this.alignContent == Align.RIGHT) {
                const maxChildWidth = this.getWidth(p)
                child.setX(this.getX(p) + maxChildWidth - child.getWidth(p))
            } else if (this.alignContent == Align.CENTER) {
                const maxChildWidth = this.getWidth(p)
                child.setX(this.getX(p) + maxChildWidth / 2 - child.getWidth(p) / 2)
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

        //drawDebugViewRect(this, p)
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

    cacheState = new CacheState()
}

class CacheState {
    height = -1
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
