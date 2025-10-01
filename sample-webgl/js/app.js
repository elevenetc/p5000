import {Free} from "../../src/p5000/containers/Free";
import {initP5000} from "../../src/p5000/initP5000";
import {GlPlaygroundDrawable, GraphNode} from "./playground-webgl";
import {DrawableView} from "../../src/p5000/views/DrawableView";
import LogView from "../../src/p5000/debug/LogView";
import Align from "../../src/p5000/Align";
// import {playgroundWebGL} from "./playground-webgl";

console.log("init app.js");

const root = new Free()

//root.addChild(new EmojiButton("🤬"), Align.CENTER)
//root.addChild(new LogView(), Align.LEFT_TOP)

const rootNode = new GraphNode(300, 100, 600, 200, [255, 0, 0])
rootNode.children.push(new GraphNode(1100, 100, 1600, 200, [0, 255, 0]))

const glView = new DrawableView(
    new GlPlaygroundDrawable(
        rootNode
    )
)

root.addChild(glView)
root.addChild(new LogView(), Align.LEFT_TOP)

initP5000(
    root,
    true,
    (p) => {
        //
    }
)

