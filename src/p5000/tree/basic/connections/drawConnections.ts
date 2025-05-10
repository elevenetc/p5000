import {BasicTreeNode, NodeView} from "../TreeModel";
import p5 from "p5";

export function drawConnections(
    n: BasicTreeNode,
    views: Map<string, NodeView>,
    defaultBackgroundAlpha: number,
    tint: [number, number, number],
    p: p5) {
    if (n == null) return
    let parentId = n.id
    n.children.forEach(child => {
        let childId = child.id
        drawConnection(views.get(parentId), views.get(childId), defaultBackgroundAlpha, tint, p)
        drawConnections(child, views, defaultBackgroundAlpha, tint, p)
    })
}

export function drawConnection(
    parent: NodeView,
    child: NodeView,
    defaultBackgroundAlpha: number,
    tint: [number, number, number],
    p: p5
) {
    let parentWidth = parent.view.getWidth(p)
    let parentHeight = parent.view.getHeight(p)
    let parentColor = p.color(tint[0], tint[1], tint[2], parent.alpha.calculate() + defaultBackgroundAlpha)
    let childColor = p.color(tint[0], tint[1], tint[2], child.alpha.calculate() + defaultBackgroundAlpha)
    drawGradientLine(
        parent.x + parentWidth, parent.y + parentHeight,
        child.x, child.y + parentHeight / 2,
        parentColor, childColor,
        p
    )
}

export function drawGradientLine(
    x1: number, y1: number,
    x2: number, y2: number,
    c1: p5.Color, c2: p5.Color,
    p: p5
) {
    p.push()

    let grad = p.drawingContext.createLinearGradient(x1, y1, x2, y2)
    grad.addColorStop(0, c1)
    grad.addColorStop(1, c2)

    p.drawingContext.strokeStyle = grad
    p.line(x1, y1, x2, y2)

    p.pop()
}