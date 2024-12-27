import ViewTransformer from "./ViewTransformer";
import p5 from "p5";
import TextView from "../text/TextView";
import {dropLastChar} from "../utils/stringUtils";
import {Backspace, Escape, KeyboardHandler, KeyChar} from "../keyboard/KeyboardHandler";

class KeyboardTypeTransformer extends ViewTransformer {

    private view: TextView
    private initText: string = null

    constructor(keyboardHandler: KeyboardHandler) {
        super()
        keyboardHandler.addListener((keyValue) => {
            if (keyValue instanceof Escape) {
                this.view.title = this.initText
            }else if (keyValue instanceof Backspace) {
                this.view.title = dropLastChar(this.view.title)
            } else if (keyValue instanceof KeyChar) {
                this.view.title = this.view.title + keyValue.char
            }
        })
    }

    transform(view: TextView, p: p5) {
        this.view = view
        if(this.initText == null){
            this.initText = view.title
        }
    }
}

export default KeyboardTypeTransformer;