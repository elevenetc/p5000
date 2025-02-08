import Vertical from "../../containers/Vertical";
import {loadAndParseTrees} from "./loadAndParseTree";
import {BasicTreeView} from "./BasicTreeView";
import Align from "../../Align";

export class TreeGroup extends Vertical {

    private trees: Array<BasicTreeView> = [];

    constructor() {
        super();
        this.alignContent = Align.CENTER
    }

    loadTrees(sources: string[]) {
        loadAndParseTrees(sources, (resultMap) => {
            console.log(resultMap);
            sources.forEach(source => {
                const result = resultMap.get(source)
                const tree = new BasicTreeView()
                tree.setRoot(result.root)
                this.trees.push(tree)
                this.addChild(tree)
            })
        })
    }

    setSelectedNode(nodeId: string) {
        this.trees.forEach(tree => {
            tree.setSelectedNode(nodeId)
        })
    }
}