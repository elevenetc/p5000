import {SegmentPart} from "./SegmentPart";
import {getSegmentPart} from "./getSegmentPart";

function buildSegmentParts(
    segment: number,
    totalSegments: number,
    totalParts: number): SegmentPart[] {
    let result: SegmentPart[] = []

    for (let part = 0; part < totalParts; part++) {
        let segmentPart = getSegmentPart(segment, part, totalSegments, totalParts);
        result.push(segmentPart);
    }
    return result
}

export {
    buildSegmentParts
}