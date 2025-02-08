import {Free} from "../../src/p5000/containers/Free";
import {PlaybackTimelineView} from "../../src/p5000/playback/PlaybackTimelineView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";
import {Direction, NavigationView} from "../../src/p5000/navigation/NavigationView";
import {initP5000} from "../../src/p5000/initP5000";
import FpsView from "../../src/p5000/debug/FpsView";
import Vertical from "../../src/p5000/containers/Vertical";
import {PlaybackControlsView} from "../../src/p5000/playback/PlaybackControlsView";
import {TreeGroup} from "../../src/p5000/tree/basic/TreeGroup";
import {PlaybackController} from "../../src/p5000/playback/PlaybackController";
import {loadAndParseTree} from "../../src/p5000/tree/basic/loadAndParseTree";

const follow = false

const root = new Free()
const treesContainer = new Vertical()

const treeGroup = new TreeGroup()
let timeline = new PlaybackTimelineView();
let navigationView = new NavigationView();

treesContainer.alignContent = Align.CENTER

let playbackGroup = new Vertical()
playbackGroup.alignContent = Align.CENTER


let controls = new PlaybackControlsView()

timeline.background = new ColorDrawable([255, 0, 0])

let controller = new PlaybackController(
    timeline,
    controls,
    treeGroup,
    50, (frame) => {
        //tre0.setSelectedNode(frame.id)

        if (follow) {
            let node = tre0.getViewNode(frame.id)
            if (node != null) {
                //tre0.setTranslationX(node.x * -1, true)
                //tre0.setTranslationY(node.y * -1, true)
            }
        }
    })

let fpsView = new FpsView()




navigationView.setClickHandler((direction) => {
    let xDiff = p.width / 10
    let yDiff = p.height / 10
    if (direction === Direction.Left) {
        //tre0.translateX(xDiff)
    } else if (direction === Direction.Right) {
        //tre0.translateX(-xDiff)
    } else if (direction === Direction.Up) {
        //tre0.translateY(yDiff)
    } else if (direction === Direction.Down) {
        //tre0.translateY(-yDiff)
    }
    //storeNumber("transX", tre0.getTranslationX())
    //storeNumber("transY", tre0.getTranslationY())
})

//tre0.setTranslationX(getNumberOrDefault("transX", 0))
//tre0.setTranslationY(getNumberOrDefault("transY", 0))

root.addChild(treeGroup, Align.CENTER)

playbackGroup.addChild(controls)
playbackGroup.addChild(timeline)

root.addChild(playbackGroup, Align.CENTER_BOTTOM)
root.addChild(fpsView, Align.LEFT_TOP)
root.addChild(navigationView, Align.LEFT_BOTTOM)

loadAndParseTree("multi-thread-tree.json", (result) => {
    timeline.setFrames(result.history)
    treeGroup.setRoots(result.roots)
})

const p = initP5000(root)