class SegmentPart {
    segment: number;
    part: number;
    x: number;
    y: number;

    constructor(
        x: number,
        y: number,
        segment: number,
        part: number,
    ) {
        this.x = x;
        this.y = y;
        this.segment = segment;
        this.part = part;
    }
}

export {
    SegmentPart
}