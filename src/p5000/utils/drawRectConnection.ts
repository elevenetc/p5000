import View from "../View";
import p5 from "p5";

export function drawRectConnection(viewA: View, viewB: View, p: p5) {
    p.line(
        viewA.getX(p) + viewA.getWidth(p),
        viewA.getY(p) + viewA.getHeight(p) / 2,
        viewB.getX(p),
        viewB.getY(p) + viewB.getHeight(p) / 2,
    )
}
