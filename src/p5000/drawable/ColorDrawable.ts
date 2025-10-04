import {Drawable} from "./Drawable";
import View from "../View";
import p5 from "p5";

class ColorDrawable implements Drawable {

    width: number = -1;
    height: number = -1;

    color: [number, number, number, number]

    constructor(color: [number, number, number, number] | null)

    constructor(...args: any[]) {
        if (args.length === 0) {
            this.color = [255, 0, 0, 255]
        } else if (args.length === 1) {
            this.color = args[0]
        }
    }

    draw(view: View, p: p5): void {
        this.width = view.getWidth(p)
        this.height = view.getHeight(p) //TODO: probably flicker case when width initially is -1
        p.push()
        p.noStroke()
        p.fill(this.color[0], this.color[1], this.color[2], this.color[3])
        p.rect(
            view.getX(p),
            view.getY(p),
            view.getWidth(p),
            view.getHeight(p)
        )
        p.pop()
    }
}

export {
    ColorDrawable
}