export function numberToScale(value: number, min: number, max: number): number {
    if (min > max) throw new Error("min must be smaller than max")
    if (value <= min) return 0;
    if (value >= max) return 255;
    return Math.round(((value - min) / (max - min)) * 255);
}