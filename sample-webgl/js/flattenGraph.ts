import {GraphNode} from "./playground-webgl";

export function flattenGraph(root: GraphNode): GraphNode[] {
    const out: GraphNode[] = [];
    const stack: GraphNode[] = [root];
    while (stack.length) {
        const n = stack.pop()!;
        out.push(n);
        if (n.children) {
            // push children so they are processed; order not critical
            for (let i = n.children.length - 1; i >= 0; i--) {
                stack.push(n.children[i]);
            }
        }
    }
    return out;
}