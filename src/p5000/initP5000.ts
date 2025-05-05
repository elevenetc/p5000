import {layoutAndRender} from "./layoutAndRender";
import View from "./View";
import p5 from "p5";

function initP5000(root: View, useWebGL: boolean = false): p5 {
    function setup(p) {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight, useWebGL ? p.WEBGL : p.P2D)

        if (useWebGL) {
            console.log("USE WEBGL MODE")
            root.setX(-p.windowWidth / 2)
            root.setY(-p.windowHeight / 2)
        }

        p.disableFriendlyErrors = true
        p.textSize(32)

        canvas.mousePressed((event) => {
            root.handleClick(event.x, event.y, p)
        })
    }

    function draw(p) {
        p.background(0, 0, 0);
        layoutAndRender(
            root,
            p,
            (view, p) => {
                root.onHoverIn(p)
            },
            (view, p) => {
                root.onHoverOut(p)
            }
        )
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

export {
    initP5000
}