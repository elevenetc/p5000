import {Drawable} from "../../src/p5000/drawable/Drawable";
import View from "../../src/p5000/View";
import p5 from "p5";
import {GraphNode, playgroundWebGL} from "./playground-webgl";

export class GraphDrawable implements Drawable {

    private root: GraphNode;

    constructor(root: GraphNode) {
        this.root = root
    }

    draw(view: View, p: p5) {
        playgroundWebGL(this.root, view, p)
    }

}