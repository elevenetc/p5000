import Vertical from "../../containers/Vertical";
import {BasicTreeNode, BasicTreeView} from "./BasicTreeView";
import Align from "../../Align";
import TextView from "../../text/TextView";
import {rgbaToRgb, stringToRgba} from "../../colorUtils";

export class TreeGroup extends Vertical {

    private trees: Array<BasicTreeView> = [];

    constructor() {
        super();
        this.alignContent = Align.CENTER
    }

    setRoots(threadsRoots: Map<string, BasicTreeNode>) {

        threadsRoots.forEach((thread, threadName) => {
            const tree = new BasicTreeView()
            tree.setRoot(thread)

            let container = new Vertical()
            let title = new TextView(threadName)
            let tint = stringToRgba(threadName);
            title.color = tint
            title.textSize = 12
            tree.setTint(rgbaToRgb(tint))


            container.alignContent = Align.CENTER
            container.addChild(title)
            container.addChild(tree)
            title.setPadding(25)

            this.trees.push(tree)
            this.addChild(container)
        })
    }

    setSelectedNode(nodeId: string) {
        this.trees.forEach(tree => {
            tree.setSelectedNode(nodeId)
        })
    }
}