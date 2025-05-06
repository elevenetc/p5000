import View from "../../View";
import p5 from "p5";
import TextView from "../../text/TextView";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import Vertical from "../../containers/Vertical";
import {AnimationValue, Ease} from "../../animation/AnimationValue";
import {BasicTreeNode, NodeView, TreeModel} from "./TreeModel";

class BasicTreeView extends View {

    //root: BasicTreeNode | null = null
    //views = new Map<string, NodeView>();

    model = new TreeModel()

    // textSize = 22 * this.scale
    // horizontalMargin = 40 * this.scale
    // verticalMargin = 40 * this.scale
    //selectedNodeId: string = null
    //layouted = false
    private defaultBackgroundAlpha = 50
    private tint: [number, number, number] = [255, 0, 0]

    constructor() {
        super();
    }

    setTint(tint: [number, number, number]) {
        this.tint = tint
    }



    setSelectedNode(nodeId: string) {

        if (!this.model.initialized) {
            //console.log(`layout isn't passed yet, skip node selection: ${nodeId}`)
            return
        }

        if (!this.model.views.has(nodeId)) {
            this.clearCurrentSelection()
            return
        }

        let selectedKey = this.model.selectedNodeId;
        if (nodeId == selectedKey) return

        if (selectedKey != nodeId && selectedKey != null) {
            this.clearCurrentSelection()
        }

        this.model.selectedNodeId = nodeId
        if (this.model.views.has(this.model.selectedNodeId)) {
            this.model.views.get(this.model.selectedNodeId).selected = true
        } else {
            console.log("failed attempt to selected node: " + nodeId + ", views count: " + this.model.views.size)
        }
    }

    render(p: p5) {
        super.render(p)

        //console.log("this.x: " + this.getX(p))

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

        //drawDebugViewRect(this, p)
        //drawYellowDebugViewRect(this, p)
    }

    getViewNode(nodeId: string): NodeView | null {
        return this.model.views.get(nodeId)
    }

    setRoot(root: BasicTreeNode) {
        this.model.root = root;
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

        if (this.model.root == null) return

        //let levels = new Map<number, BasicTreeNode[]>();
        //fillLevels(this.root, 0, levels, p)

        // this.selectedNodeId = this.root.id
        //
        // this.views = createAndLayoutNodeViews(
        //     levels,
        //     this.textSize,
        //     this.verticalMargin,
        //     this.horizontalMargin,
        //     this.selectedNodeId,
        //     p
        // )

        this.model.initAndLayout(this.model.root, p)

        //this.layouted = true
    }

    private clearCurrentSelection() {
        if (this.model.selectedNodeId != null) {
            if (this.model.views.has(this.model.selectedNodeId)) {
                this.model.views.get(this.model.selectedNodeId).selected = false
            }
            this.model.selectedNodeId = null
        }
    }

    renderNode(node: NodeView, p: p5) {
        if (node == null) return
        p.push()


        node.view.render(p)

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



function drawConnections(
    n: BasicTreeNode,
    views: Map<string, NodeView>,
    defaultBackgroundAlpha: number,
    tint: [number, number, number],
    p: p5) {
    if (n == null) return
    let parentId = n.id
    n.children.forEach(child => {
        let childId = child.id
        drawConnection(views.get(parentId), views.get(childId), defaultBackgroundAlpha, tint, p)
        drawConnections(child, views, defaultBackgroundAlpha, tint, p)
    })
}

function drawConnection(
    parent: NodeView,
    child: NodeView,
    defaultBackgroundAlpha: number,
    tint: [number, number, number],
    p: p5
) {
    let parentWidth = parent.view.getWidth(p)
    let parentHeight = parent.view.getHeight(p)
    let parentColor = p.color(tint[0], tint[1], tint[2], parent.alpha.calculate() + defaultBackgroundAlpha)
    let childColor = p.color(tint[0], tint[1], tint[2], child.alpha.calculate() + defaultBackgroundAlpha)
    drawGradientLine(
        parent.x + parentWidth, parent.y + parentHeight,
        child.x, child.y + parentHeight / 2,
        parentColor, childColor,
        p
    )
}

function drawGradientLine(
    x1: number, y1: number,
    x2: number, y2: number,
    c1: p5.Color, c2: p5.Color,
    p: p5
) {
    p.push()

    let grad = p.drawingContext.createLinearGradient(x1, y1, x2, y2)
    grad.addColorStop(0, c1)
    grad.addColorStop(1, c2)

    p.drawingContext.strokeStyle = grad
    p.line(x1, y1, x2, y2)

    p.pop()
}

export {
    BasicTreeView
}