import Vertical from "../../containers/Vertical";
import {BasicTreeView} from "./BasicTreeView";
import Align from "../../Align";
import TextView from "../../text/TextView";
import {rgbaToRgb, stringToRgba} from "../../colorUtils";
import p5 from "p5";
import {BasicTreeNode, NodeView} from "./TreeModel";
import {AnimationValue} from "../../animation/AnimationValue";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import {drawDebugRect} from "../../debug/drawDebugViewRect";

export class TreeGroup extends Vertical {

    private trees: Array<BasicTreeView> = [];
    buffer = null
    drawnFalse = false
    useCache = false
    // useCache = true

    private defaultBackgroundAlpha = 50
    private tint: [number, number, number] = [255, 0, 0]

    constructor() {
        super();
        this.alignContent = Align.CENTER
    }

    bufferCreated = false

    layout(p: p5) {


        if (this.useCache) {
            if (!this.bufferCreated) {
                this.bufferCreated = true
                super.layout(p);
                let width = this.getWidth(p) * this.scale;
                let height = this.getHeight(p) * this.scale
                this.buffer = p.createGraphics(width, height)
                console.log("created buffer: " + width + " x " + height)
            }
        } else {
            super.layout(p);
        }
    }

    render(p: p5) {

        let midX = this.getX(p);
        let midY = this.getY(p) + this.getHeight(p) / 2;


        if (this.useCache) {
            if (!this.drawnFalse) {
                console.log("render buffer")
                super.render(this.buffer)
                this.drawnFalse = true
            }

            p.image(this.buffer, this.getX(p), this.getY(p), this.getWidth(p), this.getHeight(p))
            drawDebugRect(this.getX(p), this.getY(p), this.getWidth(p), this.getHeight(p), p)
        } else {
            super.render(p)
        }

        p.push()
        p.translate(midX, midY)
        this.calculateSelectedNodesStyle(p)
        p.pop()
    }

    calculateSelectedNodesStyle(p: p5) {
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
        if(node.selected){
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
    }

    setSelectedNode(nodeId: string) {
        this.trees.forEach(tree => {
            tree.model.setSelectedNode(nodeId)
        })
    }

    setScale(scale: number) {

        this.scale = scale


        this.trees.forEach(tree => {
            tree.scale = scale
        })
        this.buffer = null
        this.drawnFalse = false
        this.bufferCreated = false

        console.log("set scale: " + scale)
    }
}