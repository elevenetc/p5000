import TextView from "../text/TextView";
import p5 from "p5";
import {viewContains} from "../View";
import {AnimationValue, Ease} from "../animation/AnimationValue";
import {P5000Config} from "../initP5000";
import {Horizontal} from "../containers/Horizontal";
import Align from "../Align";
import {EmojiButton} from "./EmojiButton";

export class TextButton extends Horizontal {

    private textView = new TextView("")
    private backgroundAlpha = new AnimationValue()
    private backgroundColor = [255, 0, 0, 0]

    private endIcon = new EmojiButton("");

    constructor(title: string = "", endIcon: string = "") {
        super();
        this.textView.title = title
        this.textView.color = [255, 0, 0, 255]
        this.textView.textSize = 20
        //this.padding = 10
        this.addChild(this.textView)
        this.addChild(this.endIcon)

        this.endIcon.setEmoji(endIcon)

        //this.setScale(new WrapContent())
        this.alignContent = Align.CENTER
        this.align = Align.CENTER
        this.clickable = true

        //this.textView.textAlign = Align.BOTTOM

        this.backgroundAlpha.setDuration(100)
        this.backgroundAlpha.setEasing(Ease.IN_OUT)

        //this.debugRender = true
        //this.textView.debugRender = true
        this.textView.setPadding(12)
    }

    init(p: p5, config: P5000Config) {
        super.init(p, config);

        this.textView.textSize = config.textStyle.basicSize
        this.endIcon.size = config.textStyle.basicSize
    }

    setEndIcon(endIcon: string) {
        this.endIcon.setEmoji(endIcon)
    }

    setTitle(title: string) {
        this.textView.title = title
    }

    getTitle(): string {
        return this.textView.title
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