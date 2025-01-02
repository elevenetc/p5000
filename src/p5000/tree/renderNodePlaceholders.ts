import {buildSegmentParts} from "./buildSegmentParts";
import {SegmentPart} from "./SegmentPart";
import p5 from "p5";

function renderNodePlaceholders(totalSegments: number, totalParts: number, p: p5) {
    for (let s = 0; s < totalSegments; s++) {
        let parts = buildSegmentParts(s, totalSegments, totalParts)

        for (let i = 0; i < parts.length; i++) {
            renderSegmentPart(parts[i], p, `Part ${i}`);
        }
    }
}

function renderSegmentPart(
    part: SegmentPart,
    p: p5,
    title: string = ""
) {

    let scale = 20
    let y = part.y * scale;
    let x = part.x * scale;

    p.push()
    p.fill("#ff0000")
    p.textSize(10)
    //p.text(title + " " + anyToString(part), y, x)

    p.noFill()

    //connection

    //circle
    p.stroke("#00ff0033")
    p.circle(y, x, 10)
    p.pop()
}

export {
    renderNodePlaceholders
}