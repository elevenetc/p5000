import View from "./View";
import p5 from "p5";
import {P5000Config} from "./initP5000";

function layoutRenderAndHandleHover(
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
    let handleHoverResult = root.handleHover(p.mouseX, p.mouseY, p)

    if (handleHoverResult) {
        onHover?.(root, p)
    } else {
        offHover?.(root, p)
    }


    if (config?.spacePressed) {
        p.cursor('grab')
    } else {
        if (handleHoverResult) {
            p.cursor('pointer');
        } else {
            p.cursor('default')
        }
    }
}

export {
    layoutRenderAndHandleHover
}