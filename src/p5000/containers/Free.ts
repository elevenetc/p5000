import View from "../View";
import Align from "../Align";
import p5 from "p5";
import {handleChildrenHover} from "../utils/viewUtils";

class Free extends View {

    children: View[] = [];
    private scale: Scale

    constructor() {
        super();
        this.setScale(new FillParent())
    }

    setScale(scale: Scale) {
        this.scale = scale
        this.scale.container = this
    }

    addChild(child: View): void {
        this.children.push(child);
        child.parent = this;
    }

    getX(p: p5): number {
        return this.scale.getX(p)
    }

    getY(p: p5): number {
        return this.scale.getY(p)
    }

    // setX(x: number): void {
    //     //throw new Error("Free is fills the whole screen");
    // }
    //
    // setY(y: number): void {
    //     //throw new Error("Free is fills the whole screen");
    // }

    getWidth(p: import("p5")): number {
        return this.scale.getWidth(p)
    }

    getHeight(p: import("p5")): number {
        return this.scale.getHeight(p)
    }

    render(p: import("p5")): void {
        super.render(p)

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const align = child.align ?? Align.LEFT_TOP
            if (align === Align.LEFT_TOP) {
                child.setX(this.getX(p))
                child.setY(this.getY(p))
            } else if (align === Align.RIGHT_TOP) {
                child.setX(this.getWidth(p) - child.getWidth(p))
                child.setY(this.getY(p))
            } else if (align === Align.RIGHT_BOTTOM) {
                child.setX(this.getWidth(p) - child.getWidth(p))
                child.setY(this.getHeight(p) - child.getHeight(p))
            } else if (align === Align.LEFT_BOTTOM) {
                child.setX(this.getX(p))
                child.setY(this.getHeight(p) - child.getHeight(p))
            } else if (align === Align.CENTER) {
                child.setX(this.x + this.getWidth(p) / 2 - child.getWidth(p) / 2)
                child.setY(this.y + this.getHeight(p) / 2 - child.getHeight(p) / 2)
            } else if (align === Align.CENTER_LEFT) {
                child.setX(this.getX(p))
                child.setY(this.getHeight(p) / 2 - child.getHeight(p) / 2)
            } else if (align === Align.CENTER_RIGHT) {
                child.setX(this.getWidth(p) - child.getWidth(p))
                child.setY(this.getHeight(p) / 2 - child.getHeight(p) / 2)
            } else if (align === Align.CENTER_TOP) {
                child.setX(this.getWidth(p) / 2 - child.getWidth(p) / 2)
                child.setY(this.getY(p))
            } else if (align === Align.CENTER_BOTTOM) {
                child.setX(this.getWidth(p) / 2 - child.getWidth(p) / 2)
                child.setY(this.getHeight(p) - child.getHeight(p))
            } else {
                throw new Error("Unknown align value at Free: " + align)
            }

            child.render(p)
        }
    }

    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        return handleChildrenHover(this.children, mouseX, mouseY, p)
    }

    contains(x: number, y: number, p: import("p5")): boolean {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child.contains(x, y, p)) {
                return true
            }
        }
        return false;
    }

    onHoverIn(p: import("p5")): void {

    }

    onHoverOut(p: import("p5")): void {

    }

}

class Scale {

    container: Free

    getX(p: p5): number {
        return 0
    }

    getY(p: p5): number {
        return 0
    }

    getWidth(p: p5): number {
        return 0
    }

    getHeight(p: p5): number {
        return 0
    }
}

/**
 * Currently supports full screen only
 */
class FillParent extends Scale {
    getX(p: p5): number {
        return 0;
    }

    getY(p: p5): number {
        return 0;
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

        let x = Number.MAX_SAFE_INTEGER

        this.container.children.forEach((child) => {
            x = Math.min(x, child.getX(p))
        });

        return x;
    }

    getY(p: p5): number {
        let y = Number.MAX_SAFE_INTEGER

        this.container.children.forEach((child) => {
            y = Math.min(y, child.getY(p))
        });

        return y;
    }

    getWidth(p: p5): number {

        let maxW = 0

        this.container.children.forEach((child) => {
            maxW = Math.max(maxW, child.getX(p) + child.getWidth(p))
        });

        return maxW - this.getX(p);
    }

    getHeight(p: p5): number {
        let maxH = 0

        this.container.children.forEach((child) => {
            maxH = Math.max(maxH, child.getY(p) + child.getHeight(p))
        });

        return maxH - this.getY(p);
    }
}

export {
    Free,
    WrapContent,
    FillParent,
    Scale
}
