import Vertical from "../../containers/Vertical";
import {BasicTreeView} from "./BasicTreeView";
import Align from "../../Align";
import {rgbaToRgb, stringToRgba} from "../../colorUtils";
import p5 from "p5";
import {BasicTreeNode, NodeView} from "./TreeModel";
import {AnimationValue} from "../../animation/AnimationValue";
import {logViewData} from "../../debug/LogView";
import {drawDebugRect} from "../../debug/drawDebugViewRect";

export class TreeGroup extends Vertical {

    private trees: Array<BasicTreeView> = [];
    buffer = null
    drawnFalse = false
    // useCache = false
    useCache = true

    private defaultBackgroundAlpha = 50
    private tint: [number, number, number] = [255, 0, 0]

    constructor() {
        super();
        this.alignContent = Align.CENTER
    }

    bufferCreated = false
    bufferWidth = -1
    bufferHeight = -1

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
                console.log("created buffer: " + this.bufferWidth + " x " + this.bufferHeight)
            }
        } else {
            super.layout(p);
        }
    }

    render(p: p5) {

        let width = this.getWidth(p)
        let height = this.getHeight(p);

        p.push()

        let x = this.getX(p)
        let y = this.getY(p)

        logViewData["x"] = x

        if (this.useCache) {



            if (!this.drawnFalse) {
                console.log("render buffer")
                this.buffer.translate(0, this.bufferHeight / 2)
                this.buffer.scale(this.scale)
                super.render(this.buffer)
                this.drawnFalse = true
            }

            let bWidth = this.buffer.width
            let bHeight = this.buffer.height

            let bWidthScaled = (bWidth - bWidth * this.scale) / 2

            let scaledWidth = width - width * this.scale
            let scaledHeight = height - height * this.scale
            let finalX = x + scaledWidth / 2;
            let finalY = y + scaledHeight / 2;
            //let finalY = y + height / 2;

            this.buffer.translate(bWidth / 2, bHeight / 2)
            p.image(this.buffer, finalX, finalY)

            logViewData["bWidth"] = bWidth
            logViewData["bWidthScaled"] = bWidthScaled

            //p.scale(this.scale)
            //p.translate(finalX, finalY)
            //this.calculateAndRenderSelection(p)

            drawDebugRect(finalX, finalY, bWidth, bHeight, p)

        }


        let scaledWidth = width - width * this.scale
        let finalX = x + scaledWidth / 2;
        let finalY = y + height / 2;

        p.translate(finalX, finalY)
        p.scale(this.scale)

        if (!this.useCache) {
            super.render(p)
        }


        this.calculateAndRenderSelection(p)

        p.pop()

        logViewData["scale"] = this.scale
        logViewData["useCache"] = this.useCache
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
        let backgroundAlpha = alpha.calculate() + this.defaultBackgroundAlpha;
        if (node.selected) {
            if (alpha.getTarget() != 255) {
                alpha.setDuration(45)
                alpha.setValue(255, true)
            }
        } else {
            if (!alpha.isActive()) {
                alpha.setDuration(500)
                alpha.setValue(0, true)
            }
        }

        // (node.view.background as ColorDrawable).color = [
        //     this.tint[0],
        //     this.tint[1],
        //     this.tint[2],
        //     backgroundAlpha
        // ]
        p.pop()
    }

    drawSelection(node: NodeView, p: p5) {
        let x = node.view.getX(p)
        let y = node.view.getY(p)
        let w = node.view.getWidth(p)
        let h = node.view.getHeight(p)
        if (node.selected) {
            p.push()
            p.stroke("rgba(0,255,0,0.21)")
            p.rect(x, y, w, h)
            p.pop()
        }

    }

    setRoots(threadsRoots: Map<string, BasicTreeNode>) {

        threadsRoots.forEach((thread, threadName) => {
            const tree = new BasicTreeView()
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
        this.reload()
    }

    setScale(scale: number) {
        this.scale = scale
        this.trees.forEach(tree => {
            tree.scale = scale
        })
    }

    reload() {
        this.buffer = null
        this.drawnFalse = false
        this.bufferCreated = false
    }
}