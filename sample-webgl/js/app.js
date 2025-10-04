import {Free} from "../../src/p5000/containers/Free";
import {initP5000} from "../../src/p5000/initP5000";
import {GraphNode} from "./playground-webgl";
import {DrawableView} from "../../src/p5000/views/DrawableView";
import LogView from "../../src/p5000/debug/LogView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";
import {GraphDrawable} from "./GraphDrawable";

const rootNodeSize = 50
const rootNode = new GraphNode(0, 0, rootNodeSize, rootNodeSize, [255, 0, 0])

function generateAreanOfChildren() {
    let d = 28
    for (let i = 0; i < 5000; i++) {
        const x = (i % d) * 25
        const y = Math.floor(i / d) * 25
        const color = [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        ]
        rootNode.children.push(new GraphNode(x, y, 10, 10, color))
    }
}

function generateHorizontalChianOfChildren() {
    let distBetweenNodes = 15;
    for (let i = 0; i < 10; i++) {
        let idx = i + 1; // 0 is root node

        const x = idx * rootNodeSize + idx * distBetweenNodes
        const color = [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        ]
        rootNode.children.push(new GraphNode(x, 0, rootNodeSize, rootNodeSize, color))
    }
}

generateAreanOfChildren();
//generateHorizontalChianOfChildren()


function initLogView(s) {
    const root = new Free()
    root.addChild(new LogView(), Align.LEFT_TOP)
    root.setX(s)
    initP5000(root)
}


function initGlView() {
    const glView = new DrawableView(new GraphDrawable(rootNode))
    const glRoot = new Free()
    glRoot.background = new ColorDrawable([22, 44, 255, 200])
    glRoot.addChild(glView, Align.LEFT_TOP)
    initP5000(glRoot, true)
}

initGlView();
initLogView(0);

