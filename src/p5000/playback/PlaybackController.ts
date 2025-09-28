import {PlaybackFrame, PlaybackTimelineView} from './PlaybackTimelineView';
import {PlaybackControlsView} from "./PlaybackControlsView";
import {TreeGroup} from "../tree/basic/TreeGroup";
import {CallStackController} from "../tree/basic/CallStackController";

class PlaybackController {

    private timelineView: PlaybackTimelineView;
    private controller: CallStackController;
    private treeView: TreeGroup;
    private handler: ((selected: PlaybackFrame) => void) | null = null;

    constructor(
        stackController: CallStackController,
        timelineView: PlaybackTimelineView,
        controlsView: PlaybackControlsView,
        treeView: TreeGroup,
        interval: number,
        handler: (selected: PlaybackFrame) => void
    ) {
        this.controller = stackController;
        this.timelineView = timelineView;
        this.handler = handler;
        this.treeView = treeView;

        controlsView.next.clickListener = () => {
            this.selectNext()
        }

        controlsView.prev.clickListener = () => {
            this.selectPrevious()
        }

        setInterval(() => {

            this.controller.selectNext()
            let currentFrame = this.controller.getCurrentFrame();
            if (currentFrame !== null) handler(currentFrame)
        }, interval);
    }

    setPlaybackView(view: PlaybackTimelineView): void {
        this.timelineView = view
    }

    selectNext() {
        //this.timelineView.selectNext()
        this.updateViews()
    }

    selectPrevious() {
        //this.timelineView.selectPrevious()
        this.updateViews();
    }

    private updateViews() {
        let currentFrame = this.controller.getCurrentFrame();
        if (currentFrame === null) return;

        if (currentFrame.index === 0) {
            this.treeView.resetStack()
        }

        this.handler(currentFrame)
        this.treeView.setSelectedNode(currentFrame.id)
    }
}

export {
    PlaybackController
}