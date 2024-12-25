import p5 from "p5";
import Free from "../../src/p5000/Free";
import TextView from "../../src/p5000/TextView";

const root = new Free()
const text = new TextView("Hello", "id")
text.color = [255, 255, 255]
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