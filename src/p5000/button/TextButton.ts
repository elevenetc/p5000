import {Free, WrapContent} from "../containers/Free";
import TextView from "../text/TextView";
import Align from "../Align";
import p5 from "p5";
import {viewContains} from "../View";
import {AnimationValue, Ease} from "../animation/AnimationValue";

export class TextButton extends Free {

    private textView = new TextView("")
    private backgroundAlpha = new AnimationValue()
    private backgroundColor = [255, 0, 0, 0]

    constructor(title: string = "") {
        super();
        this.textView.title = title
        this.textView.color = [255, 0, 0, 255]
        this.textView.textSize = 20
        this.padding = 10
        this.addChild(this.textView, Align.CENTER)
        this.setScale(new WrapContent())
        this.clickable = true

        this.backgroundAlpha.setDuration(100)
        this.backgroundAlpha.setEasing(Ease.IN_OUT)
    }

    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        let hovered = viewContains(mouseX, mouseY, this, p)
        this.onContainsHover(hovered, p)
        return hovered
    }


    handleClick(mouseX: number, mouseY: number, p: p5): boolean {
        let contains = viewContains(mouseX, mouseY, this, p)
        if (contains) this.clickListener?.call(this)
        return contains
    }

    onHoverIn(p: import("p5")) {
        this.backgroundAlpha.setValue(255)
    }

    onHoverOut(p: p5) {
        this.backgroundAlpha.setValue(0)
    }

    render(p: import("p5")) {


        p.push()

        this.textView.color = [255, this.backgroundAlpha.calculate(), this.backgroundAlpha.calculate(), 255]
        this.backgroundColor[3] = this.backgroundAlpha.calculate()
        p.fill(this.backgroundColor)
        p.rect(
            this.getX(p),
            this.getY(p),
            this.getWidth(p),
            this.getHeight(p),
            5
        )

        p.pop()

        super.render(p);
    }
}