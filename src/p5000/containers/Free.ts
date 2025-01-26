import View from "../View";
import Align from "../Align";
import p5 from "p5";
import {handleChildrenClick, handleChildrenHover} from "../utils/viewUtils";
import {drawDebugViewRect} from "../debug/drawDebugViewRect";
import {Container} from "./Container";

class Free extends View implements Container {


    children: View[] = [];
    private scale: Scale

    constructor() {
        super();
        this.setScale(new FillParent())
        this.clickable = true
    }

    getChildX(child: View, p: p5): number {
        return child.getX(p);
    }

    getChildY(child: View, p: p5): number {
        return child.getY(p);
    }

    getChildren(): View[] {
        return this.children;
    }

    setScale(scale: Scale) {
        this.scale = scale
        this.scale.setContainer(this)
    }

    addChild(child: View, align: Align = null): void {
        if (child == undefined) throw Error("child is not defined")
        child.align = align
        this.children.push(child);
        child.parent = this;
    }

    getX(p: p5): number {
        return this.scale.getX(p)
    }

    getY(p: p5): number {
        return this.scale.getY(p)
    }

    getWidth(p: import("p5")): number {
        return this.scale.getWidth(p)
    }

    getHeight(p: import("p5")): number {
        return this.scale.getHeight(p)
    }

    layout(p: p5) {
        super.layout(p);

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].layout(p)
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const align = child.align ?? Align.LEFT_TOP
            if (align === Align.LEFT_TOP) {
                child.setX(this.getX(p))
                child.setY(this.getY(p))
            } else if (align === Align.RIGHT_TOP) {
                let width1 = this.getWidth(p);
                let width2 = child.getWidth(p);
                child.setX(width1 - width2)
                child.setY(this.getY(p))
            } else if (align === Align.RIGHT_BOTTOM) {
                child.setX(this.getWidth(p) - child.getWidth(p))
                child.setY(this.getHeight(p) - child.getHeight(p))
            } else if (align === Align.LEFT_BOTTOM) {
                child.setX(this.getX(p))
                child.setY(this.getHeight(p) - child.getHeight(p))
            } else if (align === Align.CENTER) {
                let y = this.getY(p) + this.getHeight(p) / 2 - child.getHeight(p) / 2;
                child.setX(getCenterX(child, p))
                child.setY(y)
            } else if (align === Align.CENTER_LEFT) {
                child.setX(this.getX(p))
                child.setY(this.getHeight(p) / 2 - child.getHeight(p) / 2)
            } else if (align === Align.CENTER_RIGHT) {
                child.setX(this.getWidth(p) - child.getWidth(p))
                child.setY(this.getHeight(p) / 2 - child.getHeight(p) / 2)
            } else if (align === Align.CENTER_TOP) {
                child.setX(getCenterX(child, p))
                child.setY(this.getY(p))
            } else if (align === Align.CENTER_BOTTOM) {
                child.setX(getCenterX(child, p))
                child.setY(this.getHeight(p) - child.getHeight(p))
            } else {
                throw new Error("Unknown align value at Free: " + align)
            }
        }
    }

    render(p: import("p5")): void {
        super.render(p)

        drawDebugViewRect(this, p)

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].render(p)
        }
    }

    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        return handleChildrenHover(this.children, mouseX, mouseY, p)
    }

    handleClick(mouseX: number, mouseY: number, p: p5): boolean {
        return handleChildrenClick(this.children, mouseX, mouseY, p)
    }

    contains(x: number, y: number, p: import("p5")): boolean {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child.contains(x, y, p)) {
                return true
            }
        }
        return false
    }

    onHoverIn(p: import("p5")): void {

    }

    onHoverOut(p: import("p5")): void {

    }

    setX(x: number) {
        this.scale.setX(x)
    }

    setY(y: number) {
        this.scale.setY(y)
    }
}

function getCenterX(view: View, p: p5): number {
    let parentX = view.parent?.getX(p) ?? 0
    let viewWidth = view.getWidth(p);
    let parentWidth = view.parent?.getWidth(p) ?? 0
    return parentX + parentWidth / 2 - viewWidth / 2
}

function getLeftX(view: View, p: p5): number {
    return view.parent?.getX(p) ?? 0
}

function getRightX(view: View, p: p5): number {
    let parentX = view.parent?.getX(p) ?? 0
    let viewWidth = view.getWidth(p);
    let parentWidth = view.parent?.getWidth(p) ?? 0
    return parentX + parentWidth - viewWidth
}

class Scale {

    protected container: Free
    protected x: number = 0
    protected y: number = 0

    setContainer(container: Free) {
        this.container = container
    }

    setX(x: number) {
        this.x = x
    }

    setY(y: number) {
        this.y = y
    }

    getX(p: p5): number {
        throw new Error("Base Scale must not be used")
    }

    getY(p: p5): number {
        throw new Error("Base Scale must not be used")
    }

    getWidth(p: p5): number {
        throw new Error("Base Scale must not be used")
    }

    getHeight(p: p5): number {
        throw new Error("Base Scale must not be used")
    }
}

/**
 * Currently supports full screen only
 */
class FillParent extends Scale {
    getX(p: p5): number {
        return this.x;
    }

    getY(p: p5): number {
        return this.y;
    }

    getWidth(p: p5): number {
        return p.windowWidth;
    }

    getHeight(p: p5): number {
        return p.windowHeight;
    }
}

class WrapContent extends Scale {

    getX(p: p5): number {
        return this.x;
    }

    getY(p: p5): number {
        return this.y
    }

    getWidth(p: p5): number {

        let maxW = 0

        this.container.children.forEach((child) => {
            maxW = Math.max(maxW, child.getWidth(p))
        });

        return maxW
    }

    getHeight(p: p5): number {
        let maxH = 0

        this.container.children.forEach((child) => {
            maxH = Math.max(maxH, child.getHeight(p))
        });
        return maxH
    }
}

export {
    Free,
    WrapContent,
    FillParent,
    Scale
}
