import ViewTransformer from "./ViewTransformer";
import p5 from "p5";
import TextView from "../TextView";
import {dropLastChar} from "../utils/stringUtils";
import {Backspace, KeyboardHandler, KeyChar} from "../keyboard/KeyboardHandler";

class KeyboardTypeTransformer extends ViewTransformer {

    private view: TextView

    constructor(keyboardHandler: KeyboardHandler) {
        super()
        keyboardHandler.addListener((keyValue) => {
            if (keyValue instanceof Backspace) {
                this.view.title = dropLastChar(this.view.title)
            } else if (keyValue instanceof KeyChar) {
                this.view.title = this.view.title + keyValue.char
            }
        })
    }

    transform(view: TextView, p: p5) {
        this.view = view
    }
}

export default KeyboardTypeTransformer;