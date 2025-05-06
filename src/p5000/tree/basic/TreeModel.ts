import p5 from "p5";
import View from "../../View";
import {AnimationValue} from "../../animation/AnimationValue";
import Vertical from "../../containers/Vertical";
import TextView from "../../text/TextView";
import {ColorDrawable} from "../../drawable/ColorDrawable";

export class TreeModel {

    scale = 1.0
    root: BasicTreeNode = null
    levels = new Map<number, BasicTreeNode[]>();
    textSize = 22 * this.scale
    horizontalMargin = 40 * this.scale
    verticalMargin = 40 * this.scale
    selectedNodeId: string = null
    views = new Map<string, NodeView>();

    initialized = false

    initAndLayout(root: BasicTreeNode, p: p5) {
        if(this.initialized) return
        this.root = root
        fillLevels(this.root, 0, this.levels)
        this.views = createAndLayoutNodeViews(
            this.levels,
            this.textSize,
            this.verticalMargin,
            this.horizontalMargin,
            this.selectedNodeId,
            p
        )

        this.initialized = true
    }
}

export class BasicTreeNode {
    id: string = ""
    fqn: string = ""
    parent?: BasicTreeNode = null
    children: BasicTreeNode[] = []

    constructor(id: string = "") {
        this.id = id;
    }
}

export class NodeView {

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
}

function fillLevels(node: BasicTreeNode, level: number, map: Map<number, BasicTreeNode[]>) {
    let currentList: BasicTreeNode[] = [];
    if (map.has(level)) {
        currentList = map.get(level)
    } else {
        map.set(level, currentList)
    }

    currentList.push(node)

    node.children.forEach(child => {
        fillLevels(child, level + 1, map)
    })
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
        methodNameView.color = [255, 190, 255, 255]
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
