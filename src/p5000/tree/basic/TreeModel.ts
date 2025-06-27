import p5 from "p5";
import View from "../../View";
import {AnimationValue} from "../../animation/AnimationValue";
import Vertical from "../../containers/Vertical";
import TextView from "../../text/TextView";
import {ColorDrawable} from "../../drawable/ColorDrawable";
import {numberToScale} from "../../utils/numberToScale";
import {
    CallStack,
    PopStackInstruction,
    PushStackInstruction,
    ResetStackInstruction,
    StackInstruction
} from "./CallStack";
import {mapValues} from "../../utils/mapValues";
import {typeToString} from "../../debug/printType";

export class TreeModel {

    scale = 1.0
    root: BasicTreeNode = null
    levels = new Map<number, BasicTreeNode[]>();
    textSize = 22 * this.scale
    horizontalMargin = 40 * this.scale
    verticalMargin = 40 * this.scale
    selectedNodeId: string = null
    views = new Map<string, NodeView>();

    initialized = false

    minExecTime = -1
    maxExecTime = -1

    minChildren = -1
    maxChildren = -1

    stack = new CallStack()

    init(root: BasicTreeNode) {
        this.root = root
    }

    layout(p: p5) {
        if (this.initialized) return
        if (this.root == null) return
        fillLevels(this.root, 0, this.levels)
        this.views = createAndLayoutNodeViews(
            this.levels,
            this.textSize,
            this.verticalMargin,
            this.horizontalMargin,
            this.selectedNodeId,
            this,
            p
        )

        this.initialized = true
    }

    addStackInstruction(instruction: StackInstruction) {
        if (!this.initialized) return

        if (instruction instanceof PushStackInstruction) {
            let nodeId = instruction.nodeId
            let nodeView = this.views.get(nodeId)
            this.stack.push(nodeView)
        } else if (instruction instanceof PopStackInstruction) {
            this.stack.pop()
        } else if (instruction instanceof ResetStackInstruction) {
            this.stack.reset()
        } else {
            console.warn("Unknown stack instruction: ", instruction)
        }
    }

    setSelectedNode(nodeId: string) {

        if (!this.initialized) return

        if (!this.views.has(nodeId)) {
            this.clearCurrentSelection()
            let ids = mapValues(this.views, (view: NodeView) => {
                return view.id
            })
            console.warn("Failed(1) attempt to selected nodeId: " + nodeId + ", views ids: " + typeToString(ids))
            return
        }

        updateStack(nodeId, this.stack, this.views)

        let prevNodeId = this.selectedNodeId;
        if (nodeId == prevNodeId) return //already selected

        if (prevNodeId != nodeId && prevNodeId != null) {
            //clear current selection

            // let prevStack = this.stack.pop()
            //
            // if (prevStack.id != prevNodeId) {
            //     console.warn("Stack is corrupted, prevNodeId: " + prevNodeId + ", prevStack: " + prevStack.id)
            // }

            this.clearCurrentSelection()
        }


        this.selectedNodeId = nodeId
        if (this.views.has(this.selectedNodeId)) {
            let nodeView = this.views.get(this.selectedNodeId);
            //this.stack.push(nodeView)
            nodeView.selected = true
        } else {
            console.warn("Failed attempt to selected node: " + nodeId + ", views count: " + this.views.size)
        }
    }

    private clearCurrentSelection() {
        if (this.selectedNodeId != null) {
            if (this.views.has(this.selectedNodeId)) {
                this.views.get(this.selectedNodeId).selected = false
            }
            this.selectedNodeId = null
        }
    }
}

let pushId = 0

function updateStack(nodeId: string, stack: CallStack, views: Map<string, NodeView>) {
    let nodeView = views.get(nodeId);
    let node = nodeView.node

    //console.log("stack update: " + node.fqn)
    //console.log("stack update: " + node.id + ", parent: " + node?.parent?.id)

    if (stack.isEmpty()) {
        stack.push(nodeView)
        console.log((pushId++) + ": stack: push first")
    } else {

        let topCallView = stack.peek()
        let topNode = topCallView.node
        if (topCallView.id == nodeId) return

        if (topNode.parent?.id === node.id) {
            /**
             * If parent is the same for current top and new top, then we change top
             */
            console.log("stack: pop")
            stack.pop()
        }

        let fqnsEqual = topNode?.parent?.fqn === node?.parent?.fqn
        let idsEqual = topNode?.parent?.id === node?.parent?.id

        console.log((pushId++) + ": stack: push next: " + node.fqn +
            "\nparent of top `" + topNode?.parent?.fqn + "`, parent of new `" + node?.parent?.fqn +
            "`\nfqns equal: " + fqnsEqual + ", ids equal: " + idsEqual
        )
        stack.push(nodeView)


    }
}

export class BasicTreeNode {
    id: string = ""
    fqn: string = ""
    parent?: BasicTreeNode = null
    children: BasicTreeNode[] = []
    childrenMap: Map<String, BasicTreeNode> = new Map<String, BasicTreeNode>()

    start: number = -1
    end: number = -1
    execTime: number = -1

    constructor(id: string = "") {
        this.id = id;
    }
}

export class NodeView {

    id: string = ""
    fqn: string = ""
    x: number = 0
    y: number = 0

    parent?: NodeView = null

    node: BasicTreeNode

    view: View

    selected: boolean = false
    activeInStack = false

    alpha: AnimationValue = new AnimationValue()

    defaultBackground: ColorDrawable
    execBackground: ColorDrawable
    callCountBackground: ColorDrawable
}

function fillLevels(node: BasicTreeNode, level: number, map: Map<number, BasicTreeNode[]>) {
    let currentList: BasicTreeNode[] = [];
    if (map.has(level)) {
        currentList = map.get(level)
    } else {
        map.set(level, currentList)
    }

    currentList.push(node)

    node.children.forEach(child => {
        fillLevels(child, level + 1, map)
    })
}

function createAndLayoutNodeViews(
    map: Map<number, BasicTreeNode[]>,
    textSize: number,
    verticalMargin: number,
    horizontalMargin: number,
    selectedNodeId: string | null,
    model: TreeModel,
    p: p5
): Map<string, NodeView> {

    let result = new Map<string, NodeView>()
    let level = 0
    let currentX = 0
    let nodeHeight = makeView("A", "A", "A", -1).getHeight(p)//temp workaround

    function makeView(
        className: string, methodName: string,
        id: string,
        execTime: number
    ): View {

        let vertical = new Vertical()
        let classNameView = new TextView(className, "class-" + id)
        let methodNameView = new TextView(methodName, "method-" + id)
        classNameView.color = [255, 255, 255, 255]
        methodNameView.color = [255, 190, 255, 255]
        classNameView.textSize = textSize
        methodNameView.textSize = textSize

        vertical.addChild(classNameView)
        vertical.addChild(methodNameView)
        // vertical.background = new ColorDrawable([0, 0, 0, 255])
        //vertical.background = new ColorDrawable([255, 0, 0, execAlpha])
        //vertical.background = new ColorDrawable([50, 0, 0, 255])

        return vertical
    }

    function buildDefaultBackground(): ColorDrawable {
        return new ColorDrawable([50, 0, 0, 255])
    }

    function buildExecBackground(execTime: number): ColorDrawable {
        let alpha = 0

        if (execTime != -1) {
            alpha = numberToScale(execTime, model.minExecTime, model.maxExecTime)
        }

        return new ColorDrawable([255, 0, 0, alpha])
    }

    function buildCallCountBackground(callsCount: number): ColorDrawable {
        let alpha = 0

        if (callsCount != -1) {
            alpha = numberToScale(callsCount, model.minChildren, model.maxChildren)
        }

        return new ColorDrawable([255, 0, 0, alpha])
    }

    while (map.has(level)) {
        let nodes = map.get(level)
        let maxWidth = 0
        let totalHeight = nodes.length * nodeHeight + (verticalMargin) * (nodes.length - 1)
        let currentY = totalHeight / 2 * -1

        nodes.forEach(n => {
            let nodeView = new NodeView()
            nodeView.view = makeView(getClassName(n.fqn), getMethodName(n.fqn), n.id, n.execTime)
            nodeView.view.setX(currentX)
            nodeView.view.setY(currentY)
            nodeView.node = n
            nodeView.id = n.id
            nodeView.fqn = n.fqn
            nodeView.x = currentX
            nodeView.y = currentY

            nodeView.defaultBackground = buildDefaultBackground()
            nodeView.execBackground = buildExecBackground(n.execTime)
            nodeView.callCountBackground = buildCallCountBackground(n.children.length)

            currentY += nodeHeight + verticalMargin


            if (selectedNodeId != null && selectedNodeId == nodeView.id) {
                nodeView.selected = true
            }

            nodeView.view.layout(p)

            maxWidth = Math.max(maxWidth, nodeView.view.getWidth(p))

            result.set(nodeView.id, nodeView)
        })

        currentX += maxWidth + horizontalMargin
        level++
    }

    return result
}

function getClassName(fqn: string): string {
    let name = fqn
    if (name.indexOf(".") > -1) {
        let separated = name.split(".")
        name = separated[separated.length - 2]
    }
    return name
}

function getMethodName(fqn: string): string {
    let name = fqn
    if (name.indexOf(".") > -1) {
        let separated = name.split(".")
        name = separated[separated.length - 1]
    }
    return name
}
