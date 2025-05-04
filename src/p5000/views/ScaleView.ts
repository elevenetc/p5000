import {Free, WrapContent} from "../containers/Free";
import {ImageButton} from "../button/ImageButton";
import p5 from "p5";
import {drawDebugViewRect} from "../debug/drawDebugViewRect";
import {EmojiButton} from "../button/EmojiButton";

export enum ScaleAction {
    ZoomIn, ZoomOut
}

export class ScaleView extends Free {
    private readonly zoomIn: EmojiButton;
    private readonly zoomOut: EmojiButton;
    private clickHandler: ((direction: ScaleAction) => void) | null = null;

    constructor() {
        super();
        this.zoomIn = new EmojiButton("➕");
        this.zoomOut = new EmojiButton("➖");

        this.clickable = true
        this.setScale(new WrapContent()) //TODO: replace with custom scale
        this.setupButtons();
    }

    setClickHandler(handler: (direction: ScaleAction) => void) {
        this.clickHandler = handler;
    }

    layout(p: p5) {
        super.layout(p);

        const centerX = this.getX(p);
        const centerY = this.getY(p);

        this.zoomIn.layout(p);
        this.zoomIn.setX(centerX);
        this.zoomIn.setY(centerY);

        this.zoomOut.layout(p);
        this.zoomOut.setX(centerX);
        this.zoomOut.setY(centerY + this.zoomIn.getHeight(p));
    }

    render(p: p5) {
        super.render(p);
        //drawDebugViewRect(this, p)
    }

    getWidth(p: p5): number {
        return this.zoomIn.getWidth(p)
    }

    getHeight(p: p5): number {
        return this.zoomIn.getHeight(p) + this.zoomOut.getHeight(p)
    }

    handleClick(mouseX: number, mouseY: number, p: p5): boolean {
        return super.handleClick(mouseX, mouseY, p);
    }

    private setupButtons() {
        this.zoomIn.clickListener = () => this.clickHandler?.(ScaleAction.ZoomIn);
        this.zoomOut.clickListener = () => this.clickHandler?.(ScaleAction.ZoomOut);
        this.addChild(this.zoomIn);
        this.addChild(this.zoomOut);
    }
}
