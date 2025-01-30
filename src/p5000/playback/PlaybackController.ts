import {PlaybackFrame, PlaybackView} from './PlaybackView';

class PlaybackController {

    private view: PlaybackView;

    constructor(
        view: PlaybackView,
        interval: number,
        handler: (selected: PlaybackFrame) => void) {
        this.view = view;
        setInterval(() => {
            this.view.selectNext()
            handler(this.view.currentFrame())
        }, interval);
    }

    setPlaybackView(view: PlaybackView): void {
        this.view = view
    }

    onRender(): void {

    }
}

export {
    PlaybackController
}