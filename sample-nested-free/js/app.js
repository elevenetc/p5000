import {Free, WrapContent} from "../../src/p5000/containers/Free";
import TextView from "../../src/p5000/text/TextView";
import Align from "../../src/p5000/Align";
import {ColorDrawable} from "../../src/p5000/drawable/ColorDrawable";
import {initP5000} from "../../src/p5000/initP5000";

const root = new Free()


function buildNestedFree(align) {
    const result = new Free()
    let textView = new TextView(Align[align]);
    textView.color = [180, 0, 0]
    result.align = align;
    result.setScale(new WrapContent())
    result.background = new ColorDrawable([0, 100, 0, 255])
    result.addChild(textView)
    return result
}

root.addChild(buildNestedFree(Align.CENTER))
root.addChild(buildNestedFree(Align.CENTER_BOTTOM))
root.addChild(buildNestedFree(Align.CENTER_TOP))
root.addChild(buildNestedFree(Align.CENTER_LEFT))
root.addChild(buildNestedFree(Align.CENTER_RIGHT))
root.addChild(buildNestedFree(Align.LEFT_TOP))
root.addChild(buildNestedFree(Align.RIGHT_TOP))
root.addChild(buildNestedFree(Align.RIGHT_BOTTOM))
root.addChild(buildNestedFree(Align.LEFT_BOTTOM))

initP5000(root)