import {Free} from "../../src/p5000/containers/Free";
import {PlaybackTimelineView} from "../../src/p5000/playback/PlaybackTimelineView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";
import {Direction, NavigationView} from "../../src/p5000/navigation/NavigationView";
import {initP5000} from "../../src/p5000/initP5000";
import LogView from "../../src/p5000/debug/LogView";
import Vertical from "../../src/p5000/containers/Vertical";
import {PlaybackControlsView} from "../../src/p5000/playback/PlaybackControlsView";
import {TreeGroup} from "../../src/p5000/tree/basic/TreeGroup";
import {PlaybackController} from "../../src/p5000/playback/PlaybackController";
import {loadAndParseTree} from "../../src/p5000/tree/basic/loadAndParseTree";
import {ScaleAction, ScaleView} from "../../src/p5000/views/ScaleView";

let fileName = "objc-export-k2.json";
//let fileName = "tree-data-sample-small.json";
// let fileName = "tree-data-sample-super-small.json";
const scaleDiff = .1
const historySelectInterval = 200

const follow = false

const root = new Free()
const treesContainer = new Vertical()

const treeGroup = new TreeGroup()
let timeline = new PlaybackTimelineView();
let navigationView = new NavigationView();
let scaleView = new ScaleView();

treesContainer.alignContent = Align.CENTER

let playbackGroup = new Vertical()
playbackGroup.alignContent = Align.CENTER

let controls = new PlaybackControlsView()

timeline.background = new ColorDrawable([255, 0, 0])

scaleView.setClickHandler((scale) => {
    let scaleValue = treeGroup.scale
    if (scale === ScaleAction.ZoomIn) {
        scaleValue += scaleDiff
    } else {
        scaleValue -= scaleDiff
    }
    treeGroup.setScaleAndReload(scaleValue)
})

let controller = new PlaybackController(
    timeline,
    controls,
    treeGroup,
    historySelectInterval, (frame) => {
        //tre0.setSelectedNode(frame.id)
        if (frame !== undefined) {
            treeGroup.setSelectedNode(frame.id)
            //console.log(">" + frame.id)
        }


        if (follow) {
            let node = tre0.getViewNode(frame.id)
            if (node != null) {
                //tre0.setTranslationX(node.x * -1, true)
                //tre0.setTranslationY(node.y * -1, true)
            }
        }
    })

let fpsView = new LogView()


navigationView.setClickHandler((direction) => {
    let xDiff = p.width / 3 * treeGroup.scale
    let yDiff = p.height / 3 * treeGroup.scale
    if (direction === Direction.Left) {
        treeGroup.translateX(xDiff)
    } else if (direction === Direction.Right) {
        treeGroup.translateX(-xDiff)
    } else if (direction === Direction.Up) {
        treeGroup.translateY(yDiff)
    } else if (direction === Direction.Down) {
        treeGroup.translateY(-yDiff)
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
root.addChild(scaleView, Align.RIGHT_BOTTOM)


loadAndParseTree(fileName, (result) => {
    timeline.setFrames(result.history)
    treeGroup.setRoots(result.roots, result.maxExecTime, result.minExecTime)
})

const p = initP5000(root, false, (p) => {
    treeGroup.setScale(1)
    // treeGroup.setScale(1)
})