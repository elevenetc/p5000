import View from "../View";
import p5 from "p5";
import {getTextHeight} from "../utils/getTextHeight";

class EmojiButton extends View {

    size = 30
    private emoji: string;

    constructor(emoji: string) {
        super();
        this.clickable = true
        this.emoji = emoji;
    }

    setEmoji(emoji: string) {
        this.emoji = emoji
    }

    getWidth(p: p5): number {
        if (this.emoji == "") return 0
        return getTextHeight(this.size, p);
    }

    getHeight(p: p5): number {
        if (this.emoji == "") return 0
        return getTextHeight(this.size, p);
    }

    layout(p: p5) {
        super.layout(p);
    }

    render(p: p5) {
        if (this.emoji == null || this.emoji == "") return
        super.render(p);

        let h = this.getHeight(p)
        let w = this.getWidth(p)

        p.push()
        p.textSize(this.size)
        p.text(this.emoji, this.getX(p) + w * .08, this.getY(p) + h * .83)
        p.pop()
    }
}

export {
    EmojiButton
}