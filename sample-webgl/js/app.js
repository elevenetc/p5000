import {Free} from "../../src/p5000/containers/Free";
import {initP5000} from "../../src/p5000/initP5000";
import {GraphNode} from "./playground-webgl";
import LogView from "../../src/p5000/debug/LogView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";
import {GraphDrawable} from "./GraphDrawable";
import {GraphView} from "./GraphView";

const rootNodeSize = 50
const rootNode = new GraphNode(0, 0, rootNodeSize, rootNodeSize, [255, 0, 0])

function generateAreanOfChildren() {
    let distBetweenChild = 25
    let distBetween = 35;
    let childSize = 20;
    for (let i = 0; i < 5000; i++) {
        const x = (i % distBetweenChild) * distBetween
        const y = Math.floor(i / distBetweenChild) * distBetween
        const color = [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        ]
        rootNode.children.push(new GraphNode(x, y, childSize, childSize, color))
    }
}

function generateHorizontalChianOfChildren() {
    let distBetweenNodes = 15;
    for (let i = 0; i < 2; i++) {
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

// generateAreanOfChildren();
generateHorizontalChianOfChildren()


function initLogView() {
    const root = new Free()
    root.addChild(new LogView(), Align.LEFT_TOP)
    initP5000(root)
}


function initGlView() {
    const glView = new GraphView(rootNode, new GraphDrawable(rootNode))
    const glRoot = new Free()
    glRoot.background = new ColorDrawable([22, 44, 255, 200])
    glRoot.addChild(glView, Align.LEFT_TOP)
    initP5000(glRoot, true)
}

initGlView();
//initLogView();

