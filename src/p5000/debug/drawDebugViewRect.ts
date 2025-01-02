import View from "../View";
import p5 from "p5";

function drawDebugViewRect(view: View, p:p5) {
    let x = view.getX(p);
    let y = view.getY(p);
    let width = view.getWidth(p);
    let height = view.getHeight(p);
    p.push()
    p.stroke("rgba(0,255,0,0.21)")
    p.noFill()
    p.rect(x, y, width, height)
    p.circle(x, y, 30)
    p.circle(x, y, 3)
    p.textSize(20)
    p.fill("#00ff00")

    //center cross
    p.stroke("rgba(255,0,0,0.5)")
    p.line(x, y + height / 2, x + width, y + height / 2)
    p.line(x + width / 2, y, x + width / 2, y + height)

    //details
    p.stroke(0)
    p.textSize(10)
    p.text("w: " + width, x + 100, y + 100)
    p.text("h: " + height, x + 100, y + 110)
    p.text("x: " + x, x + 100, y + 120)
    p.text("y: " + y, x + 100, y + 130)
    p.pop()
}

export {
    drawDebugViewRect
}