import View from "../View";
import p5 from "p5";

class FpsView extends View {
    private textSize: number = 12;
    private color: [number, number, number] = [0, 255, 0];

    constructor() {
        super();
        this.setPadding(2);
    }

    public render(p: p5) {
        if (!this.visible) return;

        p.push();
        p.fill(this.color[0], this.color[1], this.color[2], this.alpha.calculate());
        p.textSize(this.textSize);
        p.textAlign(p.LEFT);

        const fps = Math.round(p.frameRate());
        const text = `FPS: ${fps}`;

        p.text(
            text,
            this.getX(p) + this.padding,
            this.getY(p) + this.getHeight(p) - this.padding
        );
        p.pop();
    }

    getWidth(p: p5): number {
        p.push();
        p.textSize(this.textSize);
        const text = `FPS: ${Math.round(p.frameRate())}`;
        const w = p.textWidth(text);
        p.pop();
        return w + this.padding * 2;
    }

    getHeight(p: p5): number {
        p.push();
        p.textSize(this.textSize);
        const h = p.textAscent() + p.textDescent();
        p.pop();
        return h + this.padding * 2;
    }

    setTextSize(size: number) {
        this.textSize = size;
    }

    setColor(r: number, g: number, b: number) {
        this.color = [r, g, b];
    }
}

export default FpsView;