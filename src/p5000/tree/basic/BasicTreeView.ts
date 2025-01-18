import View from "../../View";
import p5 from "p5";

class BasicTreeView extends View {

    root: BasicTreeNode | null = null
    views = new Map<string, NodeView>();
    textSize = 22

    constructor() {
        super();
    }

    setRoot(root: BasicTreeNode) {
        this.root = root;
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

        //console.log("L")

        super.layout(p);

        if (this.root == null) return

        let levels = new Map<number, BasicTreeNode[]>();
        fillLevels(this.root, 0, levels, p)
        this.views = layoutNodes(levels, this.textSize, p)
    }

    render(p: p5) {
        super.render(p)

        let midX = this.getWidth(p) / 2;
        let midY = this.getHeight(p) / 2;

        p.push()

        p.translate(midX, midY)

        this.views.forEach(v => {
            this.renderNode(v, p)
        })

        drawConnections(this.root, this.views, p)


        p.pop()
    }

    renderNode(node: NodeView, p: p5) {
        if (node == null) return
        p.push()

        p.stroke("rgba(255,0,0,0.5)")
        p.rect(node.x, node.y, node.width, node.height)
        p.textSize(this.textSize)
        p.text(node.fqn, node.x, node.y + node.height - node.height / 4)

        p.pop()
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
    p.stroke("rgba(255,0,0,0.5)")
    p.line(parent.x + parent.width, parent.y + parent.height / 2, child.x, child.y + parent.height / 2)
}

function layoutNodes(
    map: Map<number, BasicTreeNode[]>,
    textSize: number,
    p: p5
): Map<string, NodeView> {
    let result = new Map<string, NodeView>()
    let level = 0
    let currentX = 0
    let nodeHeight = getNodeViewHeight("A", textSize, p)
    let horizontalMargin = 40
    let verticalMargin = 40
    while (map.has(level)) {
        let nodes = map.get(level)
        let maxWidth = getMaxNodeWidth(nodes, textSize, p)
        let totalHeight = nodes.length * nodeHeight + (verticalMargin) * (nodes.length - 1)
        let currentY = totalHeight / 2 * -1

        nodes.forEach(n => {
            let view = new NodeView()
            view.node = n
            view.id = n.id
            view.fqn = n.fqn
            view.x = currentX
            view.y = currentY
            view.height = nodeHeight
            view.width = maxWidth
            currentY += nodeHeight + verticalMargin
            result.set(view.id, view)
        })

        currentX += maxWidth + horizontalMargin
        level++
    }

    return result
}

function getMaxNodeWidth(level: BasicTreeNode[], textSize: number, p: p5): number {
    let result = 0
    level.forEach(node => {
        result = Math.max(getNodeViewWidth(node.fqn, textSize, p), result)
    })
    return result
}

function getNodeViewWidth(text: string, textSize: number, p: p5): number {
    p.push()
    p.textSize(textSize)
    let w = p.textWidth(text)
    p.pop()
    return w
}

function getNodeViewHeight(text: string, textSize: number, p: p5): number {
    p.push()
    p.textSize(textSize)
    let h = p.textAscent() + p.textDescent()
    p.pop()
    return h
}

class NodeView {

    id: string = ""
    fqn: string = ""
    x: number = 0
    y: number = 0
    width: number = 0
    height: number = 0

    parent?: NodeView = null
    children: NodeView[] = []

    node: BasicTreeNode
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

export {
    BasicTreeView, BasicTreeNode
}