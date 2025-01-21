import {PlaybackFrame, PlaybackView} from './PlaybackView';

class PlaybackController {

    private view: PlaybackView;

    constructor(view: PlaybackView, handler: (selected: PlaybackFrame) => void) {
        this.view = view;
        setInterval(() => {
            this.view.selectNext()
            handler(this.view.currentFrame())
        }, 10);
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