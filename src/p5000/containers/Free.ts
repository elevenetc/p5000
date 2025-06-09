import View from "../View";
import Align from "../Align";
import p5 from "p5";
import {handleChildrenClick, handleChildrenHover} from "../utils/viewUtils";
import {Container} from "./Container";
import {drawDebugViewRect, drawPurpleDebugViewRect} from "../debug/drawDebugViewRect";
import {P5000Config} from "../initP5000";

class Free extends View implements Container {


    children: View[] = [];
    private groupScale: Scale

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
        this.groupScale = scale
        this.groupScale.setContainer(this)
    }

    addChild(child: View, align: Align = null): void {
        if (child == undefined) throw Error("child is not defined")
        if (align != null) child.align = align
        this.children.push(child);
        child.parent = this;
    }

    getX(p: p5): number {
        return this.groupScale.getX(p)
    }

    getY(p: p5): number {
        return this.groupScale.getY(p)
    }

    getWidth(p: import("p5")): number {
        return this.groupScale.getWidth(p) + this.padding * 2
    }

    getHeight(p: import("p5")): number {
        return this.groupScale.getHeight(p) + this.padding * 2
    }

    init(p: p5, config: P5000Config) {
        super.init(p, config);
        this.children.forEach(child => {
            child.init(p, config)
        })
    }

    layout(p: p5) {
        super.layout(p);

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].layout(p)
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const align = child.align ?? Align.LEFT_TOP
            let x = 0
            let y = 0
            if (align === Align.LEFT_TOP) {
                x = this.getX(p)
                y = this.getY(p)
            } else if (align === Align.RIGHT_TOP) {
                let width1 = this.getWidth(p);
                let width2 = child.getWidth(p);
                x = (width1 - width2)
                y = this.getY(p)
            } else if (align === Align.RIGHT_BOTTOM) {
                x = this.getWidth(p) - child.getWidth(p)
                y = this.getHeight(p) - child.getHeight(p)
            } else if (align === Align.LEFT_BOTTOM) {
                x = (this.getX(p))
                y = (this.getHeight(p) - child.getHeight(p))
            } else if (align === Align.CENTER) {
                y = this.getY(p) + this.getHeight(p) / 2 - child.getHeight(p) / 2;
                x = getCenterX(child, p)
            } else if (align === Align.CENTER_LEFT) {
                x = (this.getX(p))
                y = (this.getHeight(p) / 2 - child.getHeight(p) / 2)
            } else if (align === Align.CENTER_RIGHT) {
                x = (this.getWidth(p) - child.getWidth(p))
                y = (this.getHeight(p) / 2 - child.getHeight(p) / 2)
            } else if (align === Align.CENTER_TOP) {
                x = (getCenterX(child, p))
                y = (this.getY(p))
            } else if (align === Align.CENTER_BOTTOM) {
                x = getCenterX(child, p)
                y = this.getHeight(p) - child.getHeight(p)
            } else {
                throw new Error("Unknown align value at Free: " + align)
            }

            child.setX(x)
            child.setY(y)
        }
    }

    render(p: import("p5")): void {
        drawPurpleDebugViewRect(this, p)
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
        this.groupScale.setX(x)
    }

    setY(y: number) {
        this.groupScale.setY(y)
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
