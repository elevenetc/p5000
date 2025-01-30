import {Free} from "../../src/p5000/containers/Free";
import {BasicTreeView} from "../../src/p5000/tree/basic/BasicTreeView";
import {parseTree} from "../../src/p5000/tree/basic/parseTree";
import {PlaybackView} from "../../src/p5000/playback/PlaybackView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";
import {PlaybackController} from "../../src/p5000/playback/PlaybackController";
import {Direction, NavigationView} from "../../src/p5000/navigation/NavigationView";
import {initP5000} from "../../src/p5000/initP5000";
import FpsView from "../../src/p5000/debug/FpsView";
import {getNumberOrDefault, storeNumber} from "../../src/p5000/cookies/storeValue";

const follow = false

const root = new Free()
const tree = new BasicTreeView()
root.addChild(tree)
let playbackView = new PlaybackView();

let navigationView = new NavigationView();

playbackView.background = new ColorDrawable([255, 0, 0])
root.addChild(playbackView, Align.CENTER_BOTTOM)
let controller = new PlaybackController(playbackView, 50, (frame) => {
    tree.setSelectedNode(frame.id)

    if (follow) {
        let node = tree.getViewNode(frame.id)
        if (node != null) {
            tree.setTranslationX(node.x * -1, true)
            tree.setTranslationY(node.y * -1, true)
        }
    }
})

let fpsView = new FpsView()
root.addChild(fpsView, Align.LEFT_TOP)


navigationView.setClickHandler((direction) => {
    let xDiff = p.width / 10
    let yDiff = p.height / 10
    if (direction === Direction.Left) {
        tree.translateX(xDiff)
    } else if (direction === Direction.Right) {
        tree.translateX(-xDiff)
    } else if (direction === Direction.Up) {
        tree.translateY(yDiff)
    } else if (direction === Direction.Down) {
        tree.translateY(-yDiff)
    }
    storeNumber("transX", tree.getTranslationX())
    storeNumber("transY", tree.getTranslationY())
})

tree.setTranslationX(getNumberOrDefault("transX", 0))

tree.setTranslationY(getNumberOrDefault("transY", 0))

root.addChild(navigationView, Align.LEFT_BOTTOM)

parseTree("tree-data-sample-large.json", (result) => {
    tree.setRoot(result.root)
    playbackView.setFrames(result.history)
})

let p = initP5000(root)