import View from "../../View";
import p5 from "p5";
import TextView from "../../text/TextView";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import Vertical from "../../containers/Vertical";
import {AnimationValue, Ease} from "../../animation/AnimationValue";

class BasicTreeView extends View {

    root: BasicTreeNode | null = null
    views = new Map<string, NodeView>();

    scale = 0.5
    textSize = 22 * this.scale
    horizontalMargin = 40 * this.scale
    verticalMargin = 40 * this.scale
    selectedNodeId: string = null
    layouted = false

    private translationX = new AnimationValue(0)
    private translationY = new AnimationValue(0)
    private defaultBackgroundAlpha = 50
    private tint: [number, number, number] = [255, 0, 0]

    constructor() {
        super();
        this.translationX.setEasing(Ease.IN_OUT)
        this.translationX.setDuration(350)
        this.translationY.setEasing(Ease.IN_OUT)
        this.translationY.setDuration(350)
    }

    setTint(tint: [number, number, number]) {
        this.tint = tint
    }

    translateX(value: number) {
        this.translationX.addValue(value)
    }

    translateY(value: number) {
        this.translationY.addValue(value)
    }

    setTranslationX(value: number, animate: boolean = false) {
        this.translationX.setValue(value, animate)
    }

    setTranslationY(value: number, animate: boolean = false) {
        this.translationY.setValue(value, animate)
    }

    getTranslationX() {
        return this.translationX.getTarget()
    }

    getTranslationY() {
        return this.translationY.getTarget()
    }

    setSelectedNode(nodeId: string) {
        console.log("set selected node: " + nodeId)

        if (!this.layouted) {
            console.log(`layout isn't passed yet, skip node selection: ${nodeId}`)
            return
        }


        if (!this.views.has(nodeId)) {
            this.clearCurrentSelection()
            return
        }

        let selectedKey = this.selectedNodeId;
        if (nodeId == selectedKey) return

        if (selectedKey != nodeId && selectedKey != null) {
            this.clearCurrentSelection()
        }

        this.selectedNodeId = nodeId
        if (this.views.has(this.selectedNodeId)) {
            this.views.get(this.selectedNodeId).selected = true
        } else {
            console.log("failed attempt to selected node: " + nodeId + ", views count: " + this.views.size)
        }
    }

    render(p: p5) {
        super.render(p)

        //console.log("this.x: " + this.getX(p))

        let midX = this.getX(p) + this.translationX.calculate();
        let midY = this.getY(p) + this.getHeight(p) / 2 + this.translationY.calculate();

        p.push()
        //p.scale(3)

        p.translate(midX, midY)

        this.views.forEach(v => {
            this.renderNode(v, p)
        })

        drawConnections(this.root, this.views, this.defaultBackgroundAlpha, this.tint, p)

        p.pop()

        //drawDebugViewRect(this, p)
        //drawYellowDebugViewRect(this, p)
    }

    getViewNode(nodeId: string): NodeView | null {
        return this.views.get(nodeId)
    }

    setRoot(root: BasicTreeNode) {
        this.root = root;
        this.layouted = false
    }

    getWidth(p: p5): number {

        let minX = 0
        let maxX = 0

        this.views.forEach(view => {
            minX = Math.min(view.view.getX(p), minX)
            maxX = Math.max(view.view.getX(p) + view.view.getWidth(p), maxX)
        })

        return maxX - minX
    }

    getHeight(p: p5): number {
        let minY = 0
        let maxY = 0

        this.views.forEach(view => {
            minY = Math.min(view.view.getY(p), minY)
            maxY = Math.max(view.view.getY(p) + view.view.getHeight(p), maxY)
        })

        return maxY - minY
    }

    layout(p: p5) {

        //TODO: optimize layout, shouldn't be called if tree isn't changed
        if (this.layouted) return

        super.layout(p);

        if (this.root == null) return

        let levels = new Map<number, BasicTreeNode[]>();
        fillLevels(this.root, 0, levels, p)

        this.selectedNodeId = this.root.id

        this.views = createAndLayoutNodeViews(
            levels,
            this.textSize,
            this.verticalMargin,
            this.horizontalMargin,
            this.selectedNodeId,
            p
        )

        this.layouted = true
    }

    private clearCurrentSelection() {
        if (this.selectedNodeId != null) {
            if (this.views.has(this.selectedNodeId)) {
                this.views.get(this.selectedNodeId).selected = false
            }
            this.selectedNodeId = null
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

function fillLevels(node: BasicTreeNode, level: number, map: Map<number, BasicTreeNode[]>, p: p5) {
    let currentList: BasicTreeNode[] = [];
    if (map.has(level)) {
        currentList = map.get(level)
    } else {
        map.set(level, currentList)
    }

    currentList.push(node)

    node.children.forEach(child => {
        fillLevels(child, level + 1, map, p)
    })
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

function createAndLayoutNodeViews(
    map: Map<number, BasicTreeNode[]>,
    textSize: number,
    verticalMargin: number,
    horizontalMargin: number,
    selectedNodeId: string | null,
    p: p5
): Map<string, NodeView> {
    let result = new Map<string, NodeView>()
    let level = 0
    let currentX = 0

    function makeView(className: string, methodName: string, id: string): View {
        let vertical = new Vertical()
        let classNameView = new TextView(className, "class-" + id)
        let methodNameView = new TextView(methodName, "method-" + id)
        classNameView.color = [255, 255, 255, 255]
        methodNameView.color = [255, 255, 255, 255]
        classNameView.textSize = textSize
        methodNameView.textSize = textSize

        vertical.addChild(classNameView)
        vertical.addChild(methodNameView)
        vertical.background = new ColorDrawable([0, 0, 0, 255])

        return vertical
    }

    let nodeHeight = makeView("A", "A", "A").getHeight(p)//temp workaround

    while (map.has(level)) {
        let nodes = map.get(level)
        let maxWidth = 0//getMaxNodeWidth(nodes, textSize, p)
        let totalHeight = nodes.length * nodeHeight + (verticalMargin) * (nodes.length - 1)
        let currentY = totalHeight / 2 * -1


        nodes.forEach(n => {
            let nodeView = new NodeView()
            nodeView.view = makeView(getClassName(n.fqn), getMethodName(n.fqn), n.id)
            nodeView.view.setX(currentX)
            nodeView.view.setY(currentY)
            nodeView.node = n
            nodeView.id = n.id
            nodeView.fqn = n.fqn
            nodeView.x = currentX
            nodeView.y = currentY
            currentY += nodeHeight + verticalMargin


            if (selectedNodeId != null && selectedNodeId == nodeView.id) {
                nodeView.selected = true
            }

            nodeView.view.layout(p)

            maxWidth = Math.max(maxWidth, nodeView.view.getWidth(p))

            result.set(nodeView.id, nodeView)
        })

        currentX += maxWidth + horizontalMargin
        level++
    }

    return result
}

class NodeView {

    id: string = ""
    fqn: string = ""
    x: number = 0
    y: number = 0

    parent?: NodeView = null
    children: NodeView[] = []

    node: BasicTreeNode

    view: View

    selected: boolean = false

    alpha: AnimationValue = new AnimationValue()

    constructor() {

    }
}

class BasicTreeNode {
    id: string = ""
    fqn: string = ""
    parent?: BasicTreeNode = null
    children: BasicTreeNode[] = []

    constructor(id: string = "") {
        this.id = id;
    }
}

function getClassName(fqn: string): string {
    let name = fqn
    if (name.indexOf(".") > -1) {
        let separated = name.split(".")
        name = separated[separated.length - 2]
    }
    return name
}

function getMethodName(fqn: string): string {
    let name = fqn
    if (name.indexOf(".") > -1) {
        let separated = name.split(".")
        name = separated[separated.length - 1]
    }
    return name
}

export {
    BasicTreeView, BasicTreeNode, NodeView
}