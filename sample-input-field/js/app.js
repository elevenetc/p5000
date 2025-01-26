import p5 from "p5";
import {Free} from "../../src/p5000/containers/Free";
import TextView from "../../src/p5000/text/TextView";
import Align from "../../src/p5000/Align";
import KeyboardTypeTransformer from "../../src/p5000/transformers/KeyboardTypeTransformer";
import {KeyboardHandlerImpl} from "../../src/p5000/keyboard/KeyboardHandler";

const root = new Free()

const text = new TextView("Hello")
text.align = Align.CENTER
text.color = [255, 255, 255]
text.transformers.push(new KeyboardTypeTransformer(new KeyboardHandlerImpl()))
root.addChild(text)


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