import p5 from "p5";
import View from "../../src/p5000/View";
import {InstancedRectsRenderer} from "./InstancedRectsRenderer";

export class GraphNode {
    x!: number;
    y!: number;
    width!: number;
    height!: number;
    color!: [number, number, number]; // 0..255
    children!: GraphNode[];

    constructor(x: number, y: number, width: number, height: number, color: [number, number, number]) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.children = [];
    }

    inX(): number {
        return this.x
    }

    inY(): number {
        return this.y + this.height / 2
    }

    outX(): number {
        return this.x + this.width
    }

    outY(): number {
        return this.y + this.height / 2
    }
}


export function playgroundWebGL(root: GraphNode, container: View, p: p5): void {
    getRenderer(p).render(root, container, p);
}

/* Store one renderer per p5 instance */
const rendererByP = new WeakMap<p5, InstancedRectsRenderer>();

function getRenderer(p: p5): InstancedRectsRenderer {
    let r = rendererByP.get(p);
    if (!r) {
        r = new InstancedRectsRenderer();
        r.init(p);
        rendererByP.set(p, r);
    }
    return r;
}