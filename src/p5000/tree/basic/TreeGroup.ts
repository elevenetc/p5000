import Vertical from "../../containers/Vertical";
import {BasicTreeView} from "./BasicTreeView";
import Align from "../../Align";
import TextView from "../../text/TextView";
import {rgbaToRgb, stringToRgba} from "../../colorUtils";
import p5 from "p5";
import {BasicTreeNode} from "./TreeModel";

export class TreeGroup extends Vertical {

    private trees: Array<BasicTreeView> = [];
    buffer = null
    drawnFalse = false
    useCache = false

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
                let width = -1
                let height = -1
                width = this.getWidth(p);
                height = this.getHeight(p);
                this.buffer = p.createGraphics(width, height)
                console.log("created buffer: " + width + " x " + height)
            }
        } else {
            super.layout(p);
        }
    }

    render(p: p5) {

        if (this.useCache) {
            if (!this.drawnFalse) {
                super.render(this.buffer)
                this.drawnFalse = true
            }

            p.image(this.buffer, this.getX(p), this.getY(p))
        } else {
            super.render(p)
        }

        let midX = this.getX(p);
        let midY = this.getY(p) + this.getHeight(p) / 2;

        p.push()
        p.translate(midX, midY)
        this.renderSelection(p)
        p.pop()
    }

    renderSelection(p: p5) {
        this.trees.forEach((tree) => {
            tree.model.views.forEach((view) => {
                //if(view.selected) {
                if(view.selected || view.alpha.isActive()) {
                    console.log("render selection")
                    //view.view.render(p)
                }

                view.view.render(p)
            })
        })
    }

    setRoots(threadsRoots: Map<string, BasicTreeNode>) {

        threadsRoots.forEach((thread, threadName) => {
            const tree = new BasicTreeView()
            tree.setRoot(thread)

            let container = new Vertical()
            let title = new TextView(threadName)
            let tint = stringToRgba(threadName);
            title.color = tint
            title.textSize = 12
            tree.setTint(rgbaToRgb(tint))


            container.alignContent = Align.CENTER
            container.addChild(title)
            container.addChild(tree)
            title.setPadding(25)

            this.trees.push(tree)
            this.addChild(container)
        })
    }

    setSelectedNode(nodeId: string) {
        this.trees.forEach(tree => {
            tree.model.setSelectedNode(nodeId)
        })
    }

    setScale(scale: number) {

        this.trees.forEach(tree => {
            tree.scale = scale
        })
        this.buffer = null
        this.drawnFalse = false
        this.bufferCreated = false
    }
}