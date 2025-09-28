import p5 from "p5";
import {Free} from "../../src/p5000/containers/Free";
import {layoutAndRender} from "../../src/p5000/layoutAndRender";
import {ImageButton} from "../../src/p5000/button/ImageButton";
import Align from "../../src/p5000/Align";

const root = new Free()
const button = new ImageButton("assets/arrow_top.png")
root.addChild(button, Align.CENTER)
button.clickListener = () => {
    console.log("clicked");
}

function setup(p) {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(32);

    canvas.mousePressed((event) => {
        root.handleClick(event.x, event.y, p)
    })
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