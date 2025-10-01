import View from "../View";
import {Drawable} from "../drawable/Drawable";

export class DrawableView extends View {
    constructor(drawable: Drawable) {
        super();
        this.background = drawable
    }
}
