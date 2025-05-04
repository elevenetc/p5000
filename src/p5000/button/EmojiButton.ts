import View from "../View";
import p5 from "p5";
import {drawDebugViewRect} from "../debug/drawDebugViewRect";

class EmojiButton extends View {

    private readonly emoji: string;

    constructor(emoji: string) {
        super();
        this.clickable = true
        this.emoji = emoji;
    }

    getWidth(p: p5): number {
        return 50;
    }

    getHeight(p: p5): number {
        return 50;
    }

    layout(p: p5) {
        super.layout(p);
    }

    render(p: p5) {
        if (this.emoji == null) return
        super.render(p);
        p.push()
        p.text(this.emoji, this.getX(p) + 8, this.getY(p) + 35)
        p.pop()
        //drawDebugViewRect(this, p)
    }
}

export {
    EmojiButton
}