import View from "./View";
import p5 from "p5";

function layoutAndRender(
    view: View,
    p: p5,
    onHover?: (view: View, p: p5) => void,
    offHover?: (view: View, p: p5) => void
): void {
    view.layout(p)
    view.render(p)
    handleHover(view, p, onHover, offHover)
}

function handleHover(
    root: View,
    p: p5,
    onHover?: (view: View, p: p5) => void,
    offHover?: (view: View, p: p5) => void
): void {
    if (!onHover && !offHover) return
    if (root.handleHover(p.mouseX, p.mouseY, p)) {
        p.cursor('pointer');
        onHover?.(root, p)
    } else {
        p.cursor('default')
        offHover?.(root, p)
    }
}

export {
    layoutAndRender
}