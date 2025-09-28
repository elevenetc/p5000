import View from "../View";
import p5 from "p5";

export function drawRectConnection(viewA: View, viewB: View, p: p5, shift: number = 0) {
    p.line(
        viewA.getX(p) + viewA.getWidth(p) + shift,
        viewA.getY(p) + viewA.getHeight(p) / 2 + shift,
        viewB.getX(p) + shift,
        viewB.getY(p) + viewB.getHeight(p) / 2 + shift,
    )
}
