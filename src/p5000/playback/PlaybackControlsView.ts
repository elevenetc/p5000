import {Horizontal} from "../containers/Horizontal";
import {TextButton} from "../button/TextButton";

export class PlaybackControlsView extends Horizontal {

    prev = new TextButton("prev")
    pausePlay = new TextButton("play")
    next = new TextButton("next")

    constructor() {
        super();
        this.prev.margin = 0
        this.pausePlay.margin = 5
        this.next.margin = 0

        this.addChild(this.prev)
        this.addChild(this.pausePlay)
        this.addChild(this.next)
    }
}