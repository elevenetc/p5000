import View from "./View";
import p5 from "p5";

function layoutAndRender(view: View, p: p5): void {
    view.layout(p)
    view.render(p)
}

export {
    layoutAndRender
}