import {PlaybackFrame, PlaybackTimelineView} from './PlaybackTimelineView';
import {PlaybackControlsView} from "./PlaybackControlsView";
import {BasicTreeView} from "../tree/basic/BasicTreeView";

class PlaybackController {

    private timeline: PlaybackTimelineView;
    private tree: BasicTreeView;
    private handler: ((selected: PlaybackFrame) => void) | null = null;

    constructor(
        timeline: PlaybackTimelineView,
        controls: PlaybackControlsView,
        tree: BasicTreeView,
        interval: number,
        handler: (selected: PlaybackFrame) => void
    ) {
        this.timeline = timeline;
        this.handler = handler;
        this.tree = tree;

        controls.next.clickListener = () => {
            this.selectNext()
        }

        controls.prev.clickListener = () => {
            this.selectPrevious()
        }

        // setInterval(() => {
        //     this.timeline.selectNext()
        //     handler(this.timeline.currentFrame())
        // }, interval);
    }

    setPlaybackView(view: PlaybackTimelineView): void {
        this.timeline = view
    }

    selectNext() {
        this.timeline.selectNext()
        this.updateViews()
    }

    selectPrevious() {
        this.timeline.selectPrevious()
        this.updateViews();
    }

    private updateViews() {
        let currentFrame = this.timeline.getCurrentFrame();
        this.handler(currentFrame)
        this.tree.setSelectedNode(currentFrame.id)
    }

    onRender(): void {

    }
}

export {
    PlaybackController
}