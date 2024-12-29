import {Free, WrapContent} from "../containers/Free";
import TextView from "./TextView";
import KeyboardTypeTransformer from "../transformers/KeyboardTypeTransformer";
import {KeyboardHandler, KeyboardHandlerImpl} from "../keyboard/KeyboardHandler";
import {TextStyle} from "./TextStyle";
import {ColorDrawable} from "../drawable/ColorDrawable";
import Align from "../Align";

class InputView extends Free {

    private text = new TextView("")
    private hint = new TextView("")

    constructor(
        hintValue: string = "",
        currentValue: string = "",
        keyboardHandler: KeyboardHandler = new KeyboardHandlerImpl(),
        style: TextStyle = new TextStyle(20, [255, 255, 255, 255])
    ) {
        super()

        this.background = new ColorDrawable([0, 100, 0, 255])

        this.text.title = currentValue
        this.hint.title = hintValue

        let textAlign = Align.CENTER
        this.text.align = Align.CENTER
        this.text.textAlign = textAlign
        this.hint.textAlign = textAlign

        this.text.setStyle(style)
        this.hint.setStyle(style)

        this.hint.setAlpha(100)

        this.text.transformers.push(new KeyboardTypeTransformer(keyboardHandler))

        this.setScale(new WrapContent())
        this.addChild(this.hint)
        this.addChild(this.text)
    }


    render(p: import("p5")) {

        if (this.text.title.length == 0) {
            this.hint.setVisible(true)
            this.text.setVisible(false)
        } else {
            this.hint.setVisible(false)
            this.text.setVisible(true)
        }

        super.render(p)
    }
}

export {
    InputView
}