import View from "../View";
import {Drawable} from "../drawable/Drawable";
import p5 from "p5";

export class DrawableView extends View {
    constructor(drawable: Drawable) {
        super();
        this.background = drawable
        this.hoverHandler = (id: string, hovered: boolean, p: p5) => {
            //console.log("drawable view hovered", hovered)
        }
    }

    getX(p: p5): number {
        return 0;
    }

    getY(p: p5): number {
        return 0;
    }

    getWidth(p: p5): number {
        return p.width
    }

    getHeight(p: p5): number {
        return p.height
    }
}
