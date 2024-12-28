import p5 from "p5";
import {Free, WrapContent} from "../../src/p5000/containers/Free";
import TextView from "../../src/p5000/text/TextView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";

const root = new Free()


function buildText(align) {
    const result = new Free()
    let textView = new TextView(Align[align]);
    textView.color = [180, 0, 0]
    result.setScale(new WrapContent())
    result.align = align
    result.background = new ColorDrawable([0, 100, 0, 255])
    result.addChild(textView)
    return result
}

root.addChild(buildText(Align.CENTER))
root.addChild(buildText(Align.CENTER_BOTTOM))
root.addChild(buildText(Align.CENTER_TOP))
root.addChild(buildText(Align.CENTER_LEFT))
root.addChild(buildText(Align.CENTER_RIGHT))
root.addChild(buildText(Align.LEFT_TOP))
root.addChild(buildText(Align.RIGHT_TOP))
root.addChild(buildText(Align.RIGHT_BOTTOM))
root.addChild(buildText(Align.LEFT_BOTTOM))

function setup(p) {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(32);
}

function draw(p) {
    p.background(0, 0, 0);
    root.render(p)
}

const sketch = (p) => {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight)
};

new p5(sketch)