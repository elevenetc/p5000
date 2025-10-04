import p5 from "p5";
import View from "../../src/p5000/View";
import {Drawable} from "../../src/p5000/drawable/Drawable";
import {GraphNode} from "./playground-webgl";

export class GraphView extends View {

    rootNode: GraphNode
    hoveNode: GraphNode = null

    constructor(rootNode: GraphNode, drawable: Drawable) {
        super();
        this.background = drawable
        this.rootNode = rootNode
        this.hoverHandler = (id: string, hovered: boolean, p: p5) => {
            //console.log("drawable view hovered", hovered)
        }
    }

    getX(p: p5): number {
        return 0;
    }

    getY(p: p5): number {
        return 0;
    }

    getWidth(p: p5): number {
        return p.width
    }

    getHeight(p: p5): number {
        return p.height
    }


    contains(x: number, y: number, p: p5): boolean {
        //return super.contains(x, y, p);
        //console.log("contains", x, y)
        let found = false

        if (this.hoveNode != null) {
            this.hoveNode.selected = false
        }

        traverseGraph(this.rootNode, (node) => {
            if (x >= node.x && x <= node.x + node.width && y >= node.y && y <= node.y + node.height) {
                //console.log("contains", true)
                this.hoveNode = node
                this.hoveNode.selected = true
                found = true
            } else {
                //console.log("contains", false)
            }
        })

        if (!found) this.hoveNode = null

        return this.hoveNode != null
    }
}

function traverseGraph(root: GraphNode, visit: (node: GraphNode) => void) {
    const visited = new Set<GraphNode>();

    function traverse(node: GraphNode) {
        if (visited.has(node)) return;

        visited.add(node);
        visit(node);

        node.children.forEach(child => {
            traverse(child);
        });
    }

    traverse(root);
} 
