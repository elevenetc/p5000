import View from "./View";
import p5 from "p5";
import {P5000Config} from "./initP5000";

function layoutAndRender(
    view: View,
    p: p5,
    onHover?: (view: View, p: p5) => void,
    offHover?: (view: View, p: p5) => void,
    config?: P5000Config
): void {
    view.layout(p)
    view.render(p)
    handleHover(view, p, onHover, offHover, config)
}

function handleHover(
    root: View,
    p: p5,
    onHover?: (view: View, p: p5) => void,
    offHover?: (view: View, p: p5) => void,
    config?: P5000Config
): void {
    if (!onHover && !offHover) return
    if (root.handleHover(p.mouseX, p.mouseY, p)) {
        onHover?.(root, p)
    } else {
        offHover?.(root, p)
    }
}

export {
    layoutAndRender
}