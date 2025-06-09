import View from "../../View";
import p5 from "p5";
import {BasicTreeNode, NodeView, TreeModel} from "./TreeModel";
import {drawConnections} from "./connections/drawConnections";
import {drawDebugViewRect} from "../../debug/drawDebugViewRect";
import {TreeConfig, TreeMode} from "./TreeGroup";

class BasicTreeView extends View {

    config: TreeConfig = null
    model = new TreeModel()

    private defaultBackgroundAlpha = 50
    private tint: [number, number, number] = [255, 0, 0]

    constructor() {
        super();
    }

    setTint(tint: [number, number, number]) {
        this.tint = tint
    }

    render(p: p5) {
        super.render(p)
        p.push()

        this.model.views.forEach(v => {
            this.renderNode(v, p)
        })

        drawConnections(this.model.root, this.model.views, this.defaultBackgroundAlpha, this.tint, p)

        p.pop()

        drawDebugViewRect(this, p)
    }

    getViewNode(nodeId: string): NodeView | null {
        return this.model.views.get(nodeId)
    }

    setRoot(root: BasicTreeNode) {
        this.model.init(root);
        this.model.initialized = false
    }

    getWidth(p: p5): number {

        let minX = 0
        let maxX = 0

        this.model.views.forEach(view => {
            minX = Math.min(view.view.getX(p), minX)
            maxX = Math.max(view.view.getX(p) + view.view.getWidth(p), maxX)
        })

        return maxX - minX
    }

    getHeight(p: p5): number {
        let minY = 0
        let maxY = 0

        this.model.views.forEach(view => {
            minY = Math.min(view.view.getY(p), minY)
            maxY = Math.max(view.view.getY(p) + view.view.getHeight(p), maxY)
        })

        return maxY - minY
    }

    layout(p: p5) {

        //TODO: optimize layout, shouldn't be called if tree isn't changed
        if (this.model.initialized) return
        super.layout(p);
        this.model.layout(p)
    }

    renderNode(node: NodeView, p: p5) {
        if (node == null) return

        let mode = this.config?.mode;

        if (mode == TreeMode.EXEC_TIME) {
            node.view.background = node.execBackground
        } else if (mode == TreeMode.CALL_COUNT) {
            node.view.background = node.callCountBackground
        } else {
            node.view.background = node.defaultBackground
        }

        node.view.render(p)
    }


    handleHover(mouseX: number, mouseY: number, p: p5): boolean {
        return false
    }
}


export {
    BasicTreeView
}