import {PlaybackFrame, PlaybackTimelineView} from './PlaybackTimelineView';
import {PlaybackControlsView} from "./PlaybackControlsView";
import {TreeGroup} from "../tree/basic/TreeGroup";

class PlaybackController {

    private timeline: PlaybackTimelineView;
    private treeGroup: TreeGroup;
    private handler: ((selected: PlaybackFrame) => void) | null = null;

    constructor(
        timeline: PlaybackTimelineView,
        controls: PlaybackControlsView,
        treeGroup: TreeGroup,
        interval: number,
        handler: (selected: PlaybackFrame) => void
    ) {
        this.timeline = timeline;
        this.handler = handler;
        this.treeGroup = treeGroup;

        controls.next.clickListener = () => {
            this.selectNext()
        }

        controls.prev.clickListener = () => {
            this.selectPrevious()
        }

        setInterval(() => {
            handler(this.timeline.getCurrentFrame())
            this.timeline.selectNext()
        }, interval);
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

        if (currentFrame.index === 0) {
            this.treeGroup.resetStack()
        }

        this.handler(currentFrame)
        this.treeGroup.setSelectedNode(currentFrame.id)
    }
}

export {
    PlaybackController
}