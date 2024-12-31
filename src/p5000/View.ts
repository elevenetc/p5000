import Align from "./Align";
import p5 from "p5";
import LinearAnimationValue from "./animation/LinearAnimationValue";
import ViewTransformer from "./transformers/ViewTransformer"
import {Drawable} from "./drawable/Drawable";

class View {

    id?: string;
    align?: Align
    parent?: View;
    alpha: LinearAnimationValue = new LinearAnimationValue(255, 30, 0, 255);
    hover: boolean = false;
    background: Drawable | null = null
    protected visible = true

    protected x: number = 0
    protected y: number = 0

    transformers: ViewTransformer[] = []

    hoverHandler: (id: string, hovered: boolean, p: p5) => void;

    setVisible(value: boolean) {
        this.visible = value
    }

    setAlpha(value: number, step: number = this.alpha.step, animate: boolean = false) {
        if (animate) {
            this.alpha.setTarget(value)
        } else {
            this.alpha.setCurrent(value)
        }
    }

    getX(p: p5): number {
        return this.x;
    }

    getY(p: p5): number {
        return this.y;
    }

    setX(x: number) {
        this.x = x;
    }

    setY(y: number) {
        this.y = y;
    }

    getWidth(p: p5): number {
        throw new Error("getWidth not implemented.");
    }

    getHeight(p: p5): number {
        throw new Error("getHeight not implemented.");
    }

    layout(p: p5): void {
        this.transformers.forEach((transformer) => {
            transformer.transform(this, p)
        })
    }

    render(p: p5): void {
        if (!this.visible) return
        this.background?.draw(this, p)
    }

    onHoverIn(p: p5): void {
        this.hoverHandler?.(this.id, true, p)
    }

    onHoverOut(p: p5): void {
        this.hoverHandler?.(this.id, false, p)
    }

    contains(x: number, mouseY: number, p: p5): boolean {
        throw new Error(`${this.constructor.name}.contains not implemented.`);
    }

    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        let result = false;

        if (this.contains(mouseX, mouseY, p)) {

            if (!this.hover) {
                this.hover = true;
                console.log("handleHover: true")
                this.onHoverIn(p);
            }

            result = true;
        } else {
            if (this.hover) {
                this.hover = false;
                this.onHoverOut(p);
            }
        }
        return result;
    }
}

export default View;
