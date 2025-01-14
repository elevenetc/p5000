import View from "../View";
import p5 from "p5";
import {SegmentPart} from "./SegmentPart";
import {renderNodePlaceholders} from "./renderNodePlaceholders";
import {getMaxKey} from "../utils/geMaxKey";

class CircularTreeView extends View {

    totalSegments = 10
    totalParts = 30

    constructor() {
        super();
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

    render(p: p5) {
        super.render(p)

        let midX = this.getWidth(p) / 2;
        let midY = this.getHeight(p) / 2;

        p.push()

        p.translate(midX, midY)
        renderNodePlaceholders(this.totalSegments, this.totalParts, p)


        p.pop()
    }

    renderNode(node: TreeNode, p: p5) {
        p.push()

        p.pop()
    }
}

function to(node: TreeNode) {
    let map = new Map<number, TreeNode[]>()
    buildViewTree(node, 0, map)
    let maxLevel = getMaxKey(map)

    for (let lvl = 0; lvl <= maxLevel; lvl++) {
        let nodes = map[lvl]
    }
}

function buildViewTree(
    node: TreeNode,
    depth: number,
    levels: Map<number, TreeNode[]>
) {
    let lvl = levels[depth]
    if (lvl === undefined) {
        levels[depth] = [node]
    } else {
        levels[depth].push(node)
    }

    node.children.forEach(child => {
        buildViewTree(child, depth + 1, levels)
    })
}

class TreeNodeView {

    parent?: TreeNodeView = null
    children: TreeNodeView[] = []

    node: TreeNode
    segmentParts: SegmentPart
}

class TreeNode {
    id: string = ""
    parent?: TreeNode = null
    children: TreeNode[] = []
}

export {
    CircularTreeView
}