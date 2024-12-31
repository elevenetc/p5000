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

        this.id = "input-view"
        this.background = new ColorDrawable([0, 100, 0, 255])

        this.text.title = currentValue
        this.hint.title = hintValue

        let textAlign = Align.CENTER
        let viewAlign = Align.CENTER
        //this.text.align = viewAlign
        //this.hint.align = viewAlign
        this.text.textAlign = textAlign
        this.hint.textAlign = textAlign

        //let padding = 0
        let padding = 20
        this.text.setPadding(padding)
        this.hint.setPadding(padding)

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