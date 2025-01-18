import p5 from "p5";
import {Free} from "../../src/p5000/containers/Free";
import {layoutAndRender} from "../../src/p5000/layoutAndRender";
import {BasicTreeView} from "../../src/p5000/tree/basic/BasicTreeView";
import {parseTree} from "../../src/p5000/tree/basic/parseTree";
import {PlaybackView} from "../../src/p5000/playback/PlaybackView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";
import {PlaybackController} from "../../src/p5000/playback/PlaybackController";

const root = new Free()
const tree = new BasicTreeView()
root.addChild(tree)
let playbackView = new PlaybackView();

playbackView.background = new ColorDrawable([255, 0, 0])
root.addChild(playbackView, Align.CENTER_BOTTOM)
let controller = new PlaybackController(playbackView, (frame) => {
    tree.setSelectedNode(frame.id)
})

parseTree("tree-data-sample.json", (result) => {
    tree.setRoot(result.root)
    playbackView.setFrames(result.history)
})

// let child00 = new BasicTreeNode("ch-0-0");
// let child01 = new BasicTreeNode("ch-0-1");
// let child02 = new BasicTreeNode("ch-0-2");
//
// let child10 = new BasicTreeNode("ch-1-0");
// let child11 = new BasicTreeNode("ch-1-1");
// child00.children.push(child10, child11)
//
// let rootNode = new BasicTreeNode("root");
// rootNode.children.push(child00, child01, child02);
//tree.setRoot(rootNode)


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