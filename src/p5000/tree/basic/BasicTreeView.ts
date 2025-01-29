import View from "../../View";
import p5 from "p5";
import TextView from "../../text/TextView";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import Vertical from "../../Vertical";
import {AnimationValue, Ease} from "../../animation/AnimationValue";

class BasicTreeView extends View {

    root: BasicTreeNode | null = null
    views = new Map<string, NodeView>();

    scale = 0.5
    textSize = 22 * this.scale
    horizontalMargin = 40 * this.scale
    verticalMargin = 40 * this.scale
    selectedNodeId: string = null
    relayout = true

    private translationX = new AnimationValue(0)
    private translationY = new AnimationValue(0)

    constructor() {
        super();
        this.translationX.setEasing(Ease.IN_OUT)
        this.translationX.setDuration(250)
        this.translationY.setEasing(Ease.IN_OUT)
        this.translationY.setDuration(250)
    }

    translateX(value: number) {
        this.translationX.addValue(value)
    }

    translateY(value: number) {
        this.translationY.addValue(value)
    }

    setTranslationX(value: number) {
        this.translationX.setValue(value, false)
    }

    setTranslationY(value: number) {
        this.translationY.setValue(value, false)
    }

    getTranslationX() {
        return this.translationX.getTarget()
    }

    getTranslationY() {
        return this.translationY.getTarget()
    }

    setSelectedNode(nodeId: string) {
        let selectedKey = this.selectedNodeId;
        if (nodeId == selectedKey) return

        if (selectedKey != nodeId && selectedKey != null) {
            if (this.views.has(selectedKey)) {
                this.views.get(selectedKey).selected = false
            } else {
                //console.log("no key: " + selectedKey)
            }

        }

        this.selectedNodeId = nodeId
        if (this.views.has(this.selectedNodeId)) {
            this.views.get(this.selectedNodeId).selected = true
        }

    }

    setRoot(root: BasicTreeNode) {
        this.root = root;
        this.relayout = true
    }

    getWidth(p: p5): number {
        return this.parent?.getWidth(p)
    }

    getHeight(p: p5): number {
        return this.parent?.getHeight(p)
    }


    getX(p: p5): number {
        return this.parent?.getX(p)
    }


    getY(p: p5): number {
        return this.parent?.getY(p)
    }


    layout(p: p5) {

        //TODO: optimize layout, shouldn't be called if tree isn't changed
        if (!this.relayout) return

        super.layout(p);

        if (this.root == null) return

        let levels = new Map<number, BasicTreeNode[]>();
        fillLevels(this.root, 0, levels, p)
        this.views = createAndLayoutNodeViews(levels,
            this.textSize,
            this.verticalMargin,
            this.horizontalMargin,
            p)

        this.relayout = false
    }

    render(p: p5) {
        super.render(p)

        let midX = this.getWidth(p) / 2 + this.translationX.calculate();
        let midY = this.getHeight(p) / 2 + this.translationY.calculate();

        p.push()

        p.translate(midX, midY)

        this.views.forEach(v => {
            this.drawNode(v, p)
        })

        drawConnections(this.root, this.views, p)


        p.pop()
    }

    drawNode(node: NodeView, p: p5) {
        if (node == null) return
        p.push()


        node.view.render(p)

        if (node.selected) {
            (node.view.background as ColorDrawable).color = [255, 0, 0, 255]
            //p.fill("rgba(255,0,0,1)")
        } else {
            (node.view.background as ColorDrawable).color = [255, 0, 0, 0]
            //p.fill("rgba(0,0,0,1)")
        }

        //p.stroke("rgba(255,0,0,0.5)")
        //p.rect(node.x, node.y, node.width, node.height)

        //p.fill("rgba(255, 255, 255)")
        //p.textSize(this.textSize)


        //p.text(drawableName(node.fqn), node.x, node.y + node.height - node.height / 4)

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

function drawConnections(n: BasicTreeNode, views: Map<string, NodeView>, p: p5) {
    if (n == null) return
    let parentId = n.id
    n.children.forEach(child => {
        let childId = child.id
        drawConnection(views.get(parentId), views.get(childId), p)
        drawConnections(child, views, p)
    })
}

function drawConnection(parent: NodeView, child: NodeView, p: p5) {
    let parentWidth = parent.view.getWidth(p)
    let parentHeight = parent.view.getHeight(p)
    p.stroke("rgba(255,0,0,0.5)")
    p.line(parent.x + parentWidth, parent.y + parentHeight / 2, child.x, child.y + parentHeight / 2)
}

function createAndLayoutNodeViews(
    map: Map<number, BasicTreeNode[]>,
    textSize: number,
    verticalMargin: number,
    horizontalMargin: number,
    p: p5
): Map<string, NodeView> {
    let result = new Map<string, NodeView>()
    let level = 0
    let currentX = 0

    function makeView(className: string, methodName: string, id: string): View {
        let vertical = new Vertical()
        let classNameView = new TextView(className, "class-" + id)
        let methodNameView = new TextView(methodName, "method-" + id)
        classNameView.color = [255, 255, 255]
        methodNameView.color = [255, 255, 255]
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
    BasicTreeView, BasicTreeNode
}