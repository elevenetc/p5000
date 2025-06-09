import {layoutAndRender} from "./layoutAndRender";
import View from "./View";
import p5 from "p5";

export function initP5000(root: View, useWebGL: boolean = false, onSetup: (p: p5) => void = () => {
}): p5 {

    let config = new P5000Config()

    function setup(p: p5) {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight, useWebGL ? p.WEBGL : p.P2D)

        if (useWebGL) {
            console.log("USE WEBGL MODE")
            root.setX(-p.windowWidth / 2)
            root.setY(-p.windowHeight / 2)
        }

        p.disableFriendlyErrors = true
        p.textSize(32)

        canvas.mousePressed((event: { x: number; y: number; }) => {
            root.handleClick(event.x, event.y, p)
        })

        subscribeToKeyboard(p)
        root.init(p, config)

        onSetup(p)
    }

    function draw(p) {
        p.config = config

        if (config.spacePressed) {
            if (!config.isGrabbing) {
                if (p.mouseIsPressed) {
                    config.isGrabbing = true
                    config.grabX = p.mouseX
                    config.grabY = p.mouseY
                }
            }
        }

        if (!p.mouseIsPressed) {
            config.isGrabbing = false
        }

        p.background(0, 0, 0);
        layoutAndRender(
            root,
            p,
            (view, p) => {
                root.onHoverIn(p)
            },
            (view, p) => {
                root.onHoverOut(p)
            },
            config
        )
    }

    function subscribeToKeyboard(p: p5) {
        p.keyPressed = () => {
            if (p.key === ' ') {
                config.spacePressed = true

            }
        }

        p.keyReleased = () => {
            if (p.key === ' ') {
                config.spacePressed = false;
                config.grabX = -1
                config.grabY = -1
            }
        }
    }

    const sketch = (p) => {
        p.setup = () => setup(p);
        p.draw = () => draw(p);
        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);

            if (useWebGL) {
                root.setX(-p.windowWidth / 2)
                root.setY(-p.windowHeight / 2)
            }
        };
    };

    return new p5(sketch)
}

export class P5000Config {
    spacePressed = false

    grabX = -1
    grabY = -1

    isGrabbing = false
}