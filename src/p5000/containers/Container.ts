import p5 from "p5";
import View from "../View";

interface Container {
    getChildX(child: View, p: p5): number
    getChildY(child: View, p: p5): number
    getChildren(): View[]
    getWidth(p: p5): number
    getHeight(p: p5): number
    getX(p: p5): number
    getY(p: p5): number
}

export {
    Container
}