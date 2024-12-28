import View from "../View";
import p5 from "p5";

function drawDebugViewRect(view: View, p:p5) {
    let x = view.getX(p);
    let y = view.getY(p);
    let width = view.getWidth(p);
    let height = view.getHeight(p);
    p.push()
    p.stroke("#00ff00")
    p.noFill()
    p.rect(x, y, width, height)
    p.circle(x, y, 30)
    p.circle(x, y, 3)
    p.textSize(20)
    p.fill("#00ff00")
    p.text("w: " + width, x + 100, y + 100)
    p.text("h: " + height, x + 100, y + 120)
    p.text("x: " + x, x + 100, y + 140)
    p.text("y: " + y, x + 100, y + 160)
    p.pop()
}

export {
    drawDebugViewRect
}