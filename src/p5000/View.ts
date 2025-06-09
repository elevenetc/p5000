import Align from "./Align";
import p5 from "p5";
import LinearAnimationValue from "./animation/LinearAnimationValue";
import ViewTransformer from "./transformers/ViewTransformer"
import {Drawable} from "./drawable/Drawable";
import {Container} from "./containers/Container";
import {AnimationValue, Ease} from "./animation/AnimationValue";
import {P5000Config} from "./initP5000";

class View {

    id?: string;
    align?: Align //Used only by containers which place their children according the align
    parent?: Container;
    alpha: LinearAnimationValue = new LinearAnimationValue(255, 30, 0, 255);
    hover: boolean = false;
    background: Drawable | null = null
    protected visible = true

    protected x: number = 0
    protected y: number = 0
    protected padding: number = 0
    margin: number = 0

    transformers: ViewTransformer[] = []

    clickable: boolean = false
    clickListener: () => void | null = null

    hoverHandler: (id: string, hovered: boolean, p: p5) => void;

    private translationX = new AnimationValue(0)
    private translationY = new AnimationValue(0)

    scale = 1

    constructor() {
        this.translationX.setEasing(Ease.IN_OUT)
        this.translationX.setDuration(350)
        this.translationY.setEasing(Ease.IN_OUT)
        this.translationY.setDuration(350)
    }

    translateX(value: number) {
        this.translationX.addValue(value)
    }

    translateY(value: number) {
        this.translationY.addValue(value)
    }

    setTranslationX(value: number, animate: boolean = false) {
        this.translationX.setValue(value, animate)
    }

    setTranslationY(value: number, animate: boolean = false) {
        this.translationY.setValue(value, animate)
    }

    getTranslationX() {
        return this.translationX.getTarget()
    }

    getTranslationY() {
        return this.translationY.getTarget()
    }

    setVisible(value: boolean) {
        this.visible = value
    }

    setPadding(value: number) {
        this.padding = value
    }

    getPadding(): number {
        return this.padding
    }

    setAlpha(value: number, step: number = this.alpha.step, animate: boolean = false) {
        if (animate) {
            this.alpha.setTarget(value)
        } else {
            this.alpha.setCurrent(value)
        }
    }

    getX(p: p5): number {
        return this.x + this.translationX.calculate();
    }

    getY(p: p5): number {
        return this.y + this.translationY.calculate();
    }

    setX(x: number) {
        this.x = x;
    }

    setY(y: number) {
        this.y = y;
    }

    getWidth(p: p5): number {
        return this.padding * 2
    }

    getHeight(p: p5): number {
        return this.padding * 2
    }

    init(p: p5, config: P5000Config) {

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

    contains(x: number, y: number, p: p5): boolean {
        return viewContains(x, y, this, p)
    }

    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        let result = false;

        if (this.contains(mouseX, mouseY, p)) {
            this.onContainsHover(true, p)
            result = true;
        } else {
            this.onContainsHover(false, p)
        }
        return result;
    }

    onContainsHover(hovered: boolean, p: p5) {
        if (hovered) {
            if (!this.hover) {
                this.hover = true;
                this.onHoverIn(p);
            }
        } else {
            if (this.hover) {
                this.hover = false;
                this.onHoverOut(p);
            }
        }

    }

    handleClick(mouseX: number, mouseY: number, p: p5): boolean {
        let contains = this.contains(mouseX, mouseY, p);
        //console.log(`${this.constructor.name} - handleClick: contains: ${contains}, clickable: ${this.clickable}`);
        if (this.clickable && contains) {
            this.clickListener?.call(this)
            return true
        } else {
            return false
        }
    }
}

export function viewContains(
    x: number, y: number,
    view: View,
    p: p5
) {
    const w = view.getWidth(p)
    const h = view.getHeight(p)
    const thisX = view.getX(p)
    const thisY = view.getY(p)
    return x >= thisX && x <= thisX + w && y >= thisY && y <= thisY + h
}

export default View;
