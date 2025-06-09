import Vertical from "../../containers/Vertical";
import {BasicTreeView} from "./BasicTreeView";
import Align from "../../Align";
import {rgbaToRgb, stringToRgba} from "../../colorUtils";
import p5 from "p5";
import {BasicTreeNode, NodeView} from "./TreeModel";
import {AnimationValue} from "../../animation/AnimationValue";
import {logViewData} from "../../debug/LogView";
import {P5000Config} from "../../initP5000";

export class TreeGroup extends Vertical {

    private trees: Array<BasicTreeView> = [];
    buffer = null
    drawnFalse = false
    // useCache = false
    useCache = true

    //enableHistory = false

    private defaultBackgroundAlpha = 50
    private tint: [number, number, number] = [255, 0, 0]

    constructor() {
        super();
        this.alignContent = Align.CENTER
    }

    bufferCreated = false
    bufferWidth = -1
    bufferHeight = -1


    initDrag = false

    initTransX = -1
    initTransY = -1

    config: P5000Config
    treeConfig = new TreeConfig()

    layout(p: p5) {

        if (this.useCache) {
            if (!this.bufferCreated) {
                this.bufferCreated = true
                super.layout(p);
                let width = this.getWidth(p);
                let height = this.getHeight(p);
                this.bufferWidth = width * this.scale;
                this.bufferHeight = height * this.scale;
                this.buffer = p.createGraphics(this.bufferWidth, this.bufferHeight)
            }
        } else {
            super.layout(p);
        }
    }

    init(p: p5, config: P5000Config) {
        super.init(p, config)
        this.config = config
    }

    render(p: p5) {

        let width = this.getWidth(p)
        let height = this.getHeight(p);

        p.push()

        let x = this.getX(p)
        let y = this.getY(p)

        if (this.useCache) {


            if (!this.drawnFalse) {
                this.buffer.translate(0, this.bufferHeight / 2)
                this.buffer.scale(this.scale)
                super.render(this.buffer)
                this.drawnFalse = true
            }

            let bWidth = this.buffer.width
            let bHeight = this.buffer.height

            let scaledWidth = width - width * this.scale
            let scaledHeight = height - height * this.scale
            let finalX = x + scaledWidth / 2;
            let finalY = y + scaledHeight / 2;

            this.buffer.translate(bWidth / 2, bHeight / 2)
            p.image(this.buffer, finalX, finalY)
        }


        let scaledWidth = width - width * this.scale
        let finalX = x + scaledWidth / 2;
        let finalY = y + height / 2;

        p.translate(finalX, finalY)
        p.scale(this.scale)

        if (!this.useCache) {
            super.render(p)
        }


        if (this.treeConfig.mode == TreeMode.HISTORY) {
            this.calculateAndRenderSelection(p)
        }

        p.pop()
        logViewData["scale"] = this.scale
        logViewData["useCache"] = this.useCache

        this.handleDrag(p)
    }

    handleDrag(p: p5) {

        if (this.config.spacePressed && p.mouseIsPressed) {

            if (!this.initDrag) {
                this.initDrag = true
                this.initTransX = this.getTranslationX()
                this.initTransY = this.getTranslationY()
            }

            this.setTranslationX(this.initTransX + (this.config.grabX - p.mouseX) * -1)
            this.setTranslationY(this.initTransY + (this.config.grabY - p.mouseY) * -1)
        } else {
            this.initDrag = false
        }
    }

    calculateAndRenderSelection(p: p5) {
        this.trees.forEach((tree) => {
            tree.model.views.forEach((nodeView) => {
                this.calculateSelectedNodeStyle(nodeView, p)
                this.drawSelection(nodeView, p)
            })
        })
    }

    calculateSelectedNodeStyle(node: NodeView, p: p5) {
        p.push()
        let alpha: AnimationValue = node.alpha
        let calculatedAlpha = alpha.calculate();
        let backgroundAlpha = calculatedAlpha + this.defaultBackgroundAlpha;
        if (node.selected) {
            if (alpha.getTarget() != 255) {
                alpha.setDuration(45)
                alpha.setValue(255, true)
            }
        } else {
            if (!alpha.isActive()) {
                alpha.setDuration(2500)
                alpha.setValue(0, true)
            }
        }
        p.pop()
    }

    drawSelection(node: NodeView, p: p5) {
        let x = node.view.getX(p)
        let y = node.view.getY(p)
        let w = node.view.getWidth(p)
        let h = node.view.getHeight(p)
        let a = node.alpha.calculate()

        p.push()
        p.fill(255, 0, 0, a)
        p.rect(x, y, w, h)
        p.pop()

    }

    setRoots(
        threadsRoots: Map<string, BasicTreeNode>,
        minExecTime: number, maxExecTime: number,
        minChildren: number, maxChildren: number
    ) {

        logViewData["min exec time"] = minExecTime
        logViewData["max exec time"] = maxExecTime
        logViewData["min children"] = minChildren
        logViewData["max children"] = maxChildren

        threadsRoots.forEach((thread, threadName) => {
            const tree = new BasicTreeView()
            tree.model.minExecTime = minExecTime
            tree.model.maxExecTime = maxExecTime
            tree.model.minChildren = minChildren
            tree.model.maxChildren = maxChildren
            tree.setRoot(thread)

            //let container = new Vertical()
            //let title = new TextView(threadName)
            let tint = stringToRgba(threadName);
            //title.color = tint
            //title.textSize = 12
            tree.setTint(rgbaToRgb(tint))


            //container.alignContent = Align.CENTER
            //container.addChild(title)
            //container.addChild(tree)
            //title.setPadding(25)

            tree.config = this.treeConfig

            this.trees.push(tree)
            //this.addChild(container)
            this.addChild(tree)
        })

        this.setScale(this.scale)
    }

    setSelectedNode(nodeId: string) {
        this.trees.forEach(tree => {
            tree.model.setSelectedNode(nodeId)
        })
    }

    setScaleAndReload(scale: number) {
        this.setScale(scale)
        this.rerenderCache()
    }

    setScale(scale: number) {
        this.scale = scale
        this.trees.forEach(tree => {
            tree.scale = scale
        })
    }

    rerenderCache() {
        this.buffer = null
        this.drawnFalse = false
        this.bufferCreated = false
    }

    setMode(mode: string) {
        this.treeConfig.mode = mode
        this.rerenderCache()
    }
}

export class TreeConfig {
    mode = TreeMode.DEFAULT
}

export class TreeMode {
    static HISTORY = "history"
    static EXEC_TIME = "exec-time"
    static CALL_COUNT = "call-count"
    static DEFAULT = "default"
}