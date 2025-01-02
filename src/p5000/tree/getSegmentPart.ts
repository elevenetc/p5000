import {SegmentPart} from "./SegmentPart";

function getSegmentPart(
    segment: number,      // which wedge, 1-based
    part: number,         // which ring, 1-based
    totalSegments: number,
    totalParts: number
): SegmentPart {
    //
    // 1) Determine the angle for this segment.
    //    We’ll orient segment=1 "straight up" => angle = π/2.
    //    Subsequent segments rotate counterclockwise from that.
    //
    const angleStep = (2 * Math.PI) / totalSegments;
    const angle = Math.PI / 2 + (segment) * angleStep;

    //
    // 2) Determine the radius for this part (ring).
    //    If we want the last part (part = totalParts) to have radius = totalParts,
    //    then radius = (part / totalParts) * totalParts = part.
    //    Shown below explicitly to highlight the usage of totalParts.
    //
    const maxRadius = totalParts;
    const radius = (part / totalParts) * maxRadius;
    // This simplifies numerically to "part",
    // but demonstrates how you'd incorporate totalParts.

    //
    // 3) Convert from polar (radius, angle) to Cartesian (x, y).
    //
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);



    return new SegmentPart(
        x,
        y,
        segment,
        part
    );
}

export {
    getSegmentPart
}