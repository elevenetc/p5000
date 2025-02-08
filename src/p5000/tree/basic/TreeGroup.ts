import Vertical from "../../containers/Vertical";
import {BasicTreeNode, BasicTreeView} from "./BasicTreeView";
import Align from "../../Align";

export class TreeGroup extends Vertical {

    private trees: Array<BasicTreeView> = [];

    constructor() {
        super();
        this.alignContent = Align.CENTER
    }

    setRoots(threadsRoots: Map<String, BasicTreeNode>) {

        threadsRoots.forEach(thread => {
            const tree = new BasicTreeView()
            tree.setRoot(thread)
            this.trees.push(tree)
            this.addChild(tree)
        })
    }

    setSelectedNode(nodeId: string) {
        this.trees.forEach(tree => {
            tree.setSelectedNode(nodeId)
        })
    }
}