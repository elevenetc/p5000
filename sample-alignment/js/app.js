import p5 from "p5";
import Free from "../../src/p5000/Free";
import TextView from "../../src/p5000/TextView";
import Align from "../../src/p5000/Align";

const root = new Free()

root.addChild(makeText("Center", Align.CENTER))
root.addChild(makeText("Top left", Align.LEFT_TOP))
root.addChild(makeText("Top right", Align.RIGHT_TOP))
root.addChild(makeText("Bottom left", Align.LEFT_BOTTOM))
root.addChild(makeText("Bottom right", Align.RIGHT_BOTTOM))
root.addChild(makeText("Center right", Align.CENTER_LEFT))
root.addChild(makeText("Center left", Align.CENTER_RIGHT))
root.addChild(makeText("Center top", Align.CENTER_TOP))
root.addChild(makeText("Center bottom", Align.CENTER_BOTTOM))

function makeText(text, alignment) {
    const result = new TextView(text);
    result.color = [255, 255, 255, 255]
    result.align = alignment
    return result
}

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