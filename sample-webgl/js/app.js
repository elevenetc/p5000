import {Free} from "../../src/p5000/containers/Free";
import {initP5000} from "../../src/p5000/initP5000";
import {GlPlaygroundDrawable, GraphNode} from "./playground-webgl";
import {DrawableView} from "../../src/p5000/views/DrawableView";
import LogView from "../../src/p5000/debug/LogView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";


const rootNode = new GraphNode(0, 0, 300, 300, [255, 0, 0])

function generateChildren() {
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

generateChildren();


function initLogView(s) {
    const root = new Free()
    root.addChild(new LogView(), Align.LEFT_TOP)
    root.setX(s)
    initP5000(root)
}


function initGlView() {
    const glView = new DrawableView(
        new GlPlaygroundDrawable(
            rootNode
        )
    )
    const glRoot = new Free()
    glRoot.background = new ColorDrawable([22, 44, 255, 200])
    glRoot.addChild(glView)
    initP5000(glRoot, true)
}

initGlView();
initLogView(0);

