import p5 from "p5";
import {Free} from "../../src/p5000/containers/Free";
import {layoutAndRender} from "../../src/p5000/layoutAndRender";
import {BasicTreeNode, BasicTreeView} from "../../src/p5000/tree/basic/BasicTreeView";

const root = new Free()
const tree = new BasicTreeView()
root.addChild(tree)


let child00 = new BasicTreeNode("ch-0-0");
let child01 = new BasicTreeNode("ch-0-1");
let child02 = new BasicTreeNode("ch-0-2");

let child10 = new BasicTreeNode("ch-1-0");
let child11 = new BasicTreeNode("ch-1-1");
child00.children.push(child10, child11)

let rootNode = new BasicTreeNode("root");
rootNode.children.push(child00, child01, child02);
tree.setRoot(rootNode)

function setup(p) {
    console.log("setup")
    p.createCanvas(p.windowWidth, p.windowHeight);
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