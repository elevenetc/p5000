import p5 from "p5";
import {Free} from "../../src/p5000/containers/Free";
import TextView from "../../src/p5000/text/TextView";
import Align from "../../src/p5000/Align";
import Vertical from "../../src/p5000/containers/Vertical";
import {layoutAndRender} from "../../src/p5000/layoutAndRender";

const root = new Free()
const vertical = new Vertical()
vertical.align = Align.CENTER
vertical.alignContent = Align.LEFT
root.addChild(vertical)
vertical.addChild(makeText("Text-A", Align.CENTER))
vertical.addChild(makeText("Text-BBB", Align.CENTER))
vertical.addChild(makeText("Text-C", Align.CENTER))

function makeText(text, alignment) {
    const result = new TextView(text, "id:" + text, (id, hovered, p) => {
        console.log(`hovered: ${hovered}`)
    });
    result.color = [255, 255, 255]
    result.align = alignment
    return result
}

function setup(p) {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(32);
}

function draw(p) {
    p.background(0, 0, 0)
    layoutAndRender(root, p)
}

const sketch = (p) => {
    p.setup = () => setup(p);
    p.draw = () => draw(p);
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
};

new p5(sketch);