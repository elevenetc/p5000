import p5 from "p5";
import Free from "../../src/p5000/Free";
import TextView from "../../src/p5000/TextView";
import Align from "../../src/p5000/Align";
import SelectionTextOverlay from "../../src/p5000/text/SelectionTextOverlay";
import KeyboardTypeTransformer from "../../src/p5000/transformers/KeyboardTypeTransformer";
import {KeyboardHandlerImpl} from "../../src/p5000/keyboard/KeyboardHandler";

const root = new Free()

const text = new TextView("Hello world! Hello world! Hello world! Hello world!");
text.color = [255, 255, 255, 255]
text.align = Align.CENTER
text.overlays.push(new SelectionTextOverlay(new KeyboardHandlerImpl()))

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