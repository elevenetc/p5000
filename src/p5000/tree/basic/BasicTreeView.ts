import View from "../../View";
import p5 from "p5";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import {AnimationValue} from "../../animation/AnimationValue";
import {BasicTreeNode, NodeView, TreeModel} from "./TreeModel";
import {drawConnections} from "./connections/drawConnections";

class BasicTreeView extends View {
    model = new TreeModel()
    private defaultBackgroundAlpha = 50
    private tint: [number, number, number] = [255, 0, 0]

    constructor() {
        super();
    }

    setTint(tint: [number, number, number]) {
        this.tint = tint
    }

    render(p: p5) {
        super.render(p)

        let midX = this.getX(p);
        let midY = this.getY(p) + this.getHeight(p) / 2;

        p.push()
        p.scale(this.scale)

        p.translate(midX, midY)

        this.model.views.forEach(v => {
            this.renderNode(v, p)
        })

        drawConnections(this.model.root, this.model.views, this.defaultBackgroundAlpha, this.tint, p)

        p.pop()
    }

    getViewNode(nodeId: string): NodeView | null {
        return this.model.views.get(nodeId)
    }

    setRoot(root: BasicTreeNode) {
        this.model.init(root);
        this.model.initialized = false
    }

    getWidth(p: p5): number {

        let minX = 0
        let maxX = 0

        this.model.views.forEach(view => {
            minX = Math.min(view.view.getX(p), minX)
            maxX = Math.max(view.view.getX(p) + view.view.getWidth(p), maxX)
        })

        return maxX - minX
    }

    getHeight(p: p5): number {
        let minY = 0
        let maxY = 0

        this.model.views.forEach(view => {
            minY = Math.min(view.view.getY(p), minY)
            maxY = Math.max(view.view.getY(p) + view.view.getHeight(p), maxY)
        })

        return maxY - minY
    }

    layout(p: p5) {

        //TODO: optimize layout, shouldn't be called if tree isn't changed
        if (this.model.initialized) return
        super.layout(p);
        this.model.layout(p)
    }

    renderNode(node: NodeView, p: p5) {
        if (node == null) return
        p.push()


        node.view.render(p)

        let alpha: AnimationValue = node.alpha
        let backgroundAlpha = alpha.calculate() + this.defaultBackgroundAlpha;
        if (node.selected) {
            console.log("selected!!")
            if (alpha.getTarget() != 255) {
                alpha.setDuration(45)
                alpha.setValue(255, true)
            }
        } else {
            console.log("not selected!!")
            if (!alpha.isActive()) {
                alpha.setDuration(500)
                alpha.setValue(0, true)
            }
        }

        (node.view.background as ColorDrawable).color = [
            this.tint[0],
            this.tint[1],
            this.tint[2],
            backgroundAlpha
        ]

        p.pop()
    }


    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        return false
    }
}


export {
    BasicTreeView
}