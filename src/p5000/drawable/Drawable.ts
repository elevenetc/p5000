import p5 from "p5";
import View from "../View";

interface Drawable {
    draw(view: View, p: p5)
}

export {
    Drawable
}