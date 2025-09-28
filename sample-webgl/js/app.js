import {Free} from "../../src/p5000/containers/Free";
import Align from "../../src/p5000/Align";
import {initP5000} from "../../src/p5000/initP5000";
//import {WebGLRect} from "../../src/p5000/views/WebGLRect";
import LogView from "../../src/p5000/debug/LogView";
import {EmojiButton} from "../../src/p5000/button/EmojiButton";

const root = new Free()

//root.addChild(new WebGLRect(), Align.CENTER)
root.addChild(new EmojiButton("🤬"), Align.CENTER)
root.addChild(new LogView(), Align.LEFT_TOP)

initP5000(root, true)