import View from "../View";
import p5 from "p5";
import {getSegmentPart} from "./getSegmentPart";
import {SegmentPart} from "./SegmentPart";
import {renderNodePlaceholders} from "./renderNodePlaceholders";

class TreeView extends View {

    totalSegments = 200
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

class TreeNode {
    name: String = ""
    parent?: TreeNode = null
    children: TreeNode[] = []
}

export {
    TreeView
}