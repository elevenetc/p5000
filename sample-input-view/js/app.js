import p5 from "p5";
import {Free} from "../../src/p5000/containers/Free";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";
import {InputView} from "../../src/p5000/text/InputView";
import {TextStyle} from "../../src/p5000/text/TextStyle";
import Align from "../../src/p5000/Align";
import {KeyboardHandlerImpl} from "../../src/p5000/keyboard/KeyboardHandler";
import {layoutRenderAndHandleHover} from "../../src/p5000/layoutRenderAndHandleHover";

const root = new Free()
root.background = new ColorDrawable([50, 0, 0, 255])

const inputView = new InputView(
    "Type something",
    "",
    new KeyboardHandlerImpl(),
    new TextStyle(33, [255, 0, 0])
)

inputView.align = Align.CENTER

root.addChild(inputView)

function setup(p) {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(32);
}

function draw(p) {
    p.background(0, 0, 0);
    layoutRenderAndHandleHover(root, p)
}

const sketch = (p) => {
    p.setup = () => setup(p);
    p.draw = () => draw(p);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
};

new p5(sketch);