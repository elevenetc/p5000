import p5 from "p5";
import {Free} from "../../src/p5000/containers/Free";
import {layoutAndRender} from "../../src/p5000/layoutAndRender";
import {CircularTreeView} from "../../src/p5000/tree/circular/CircularTreeView";

const root = new Free()
const tree = new CircularTreeView()
root.addChild(tree)

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