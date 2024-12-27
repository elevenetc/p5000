import p5 from "p5";
import {FillParent, Free, WrapContent} from "../../src/p5000/containers/Free";
import TextView from "../../src/p5000/text/TextView";
import Align from "../../src/p5000/Align";
import SelectionTextOverlay from "../../src/p5000/text/SelectionTextOverlay";
import KeyboardTypeTransformer from "../../src/p5000/transformers/KeyboardTypeTransformer";
import {KeyboardHandlerImpl} from "../../src/p5000/keyboard/KeyboardHandler";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";

const root = new Free()
root.background = new ColorDrawable()

const text = new TextView("Hello world");
text.align = Align.CENTER
text.color = [0, 0, 100]

const container = new Free()
container.setScale(new WrapContent())
container.align = Align.CENTER
container.background = new ColorDrawable([0, 100, 0, 255])
container.addChild(text)

root.addChild(container)

function setup(p) {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(32);
}

function draw(p) {
    p.background(0, 0, 0);
    root.render(p)
}

const sketch = (p) => {
    p.setup = () => setup(p);
    p.draw = () => draw(p);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
};

new p5(sketch);