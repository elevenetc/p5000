import p5 from "p5";
import {Free} from "../../src/p5000/containers/Free";
import TextView from "../../src/p5000/text/TextView";
import Align from "../../src/p5000/Align";
import SelectionTextOverlay from "../../src/p5000/text/SelectionTextOverlay";
import KeyboardTypeTransformer from "../../src/p5000/transformers/KeyboardTypeTransformer";
import {KeyboardHandlerImpl} from "../../src/p5000/keyboard/KeyboardHandler";

const root = new Free()

let keyboardHandler = new KeyboardHandlerImpl();

const text = new TextView("Hello world");
text.color = [255, 255, 255, 255]
text.align = Align.CENTER
text.overlays.push(new SelectionTextOverlay(keyboardHandler))

const filterText = new TextView("type to filer")
filterText.color = [255, 255, 255]
filterText.setAlpha(20)
filterText.align = Align.CENTER_BOTTOM
filterText.transformers.push(new KeyboardTypeTransformer(keyboardHandler))

root.addChild(text)
root.addChild(filterText)

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