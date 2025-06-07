import p5 from "p5";

/**
 * ```
 * verifyCoords(0, 30, p, (x, y) => {
 *             p.push()
 *             p.textSize(20)
 *             p.fill(255, 0, 0)
 *             p.text("scale: " + this.scale + ", useCache: " + this.useCache, x, y)
 *             p.pop()
 *         })
 * ```
 * @param x
 * @param y
 * @param p
 * @param callback
 */
export function verifyCoords(x: number, y: number, p: p5, callback: (x: number, y: number) => void) {
    const m = p.drawingContext.getTransform();
    const pt = new DOMPoint(x, y).matrixTransform(m);

    if (pt.x < 0 || pt.x > p.width || pt.y < 0 || pt.y > p.height) {
        console.warn(`Rendering at (${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) is outside canvas`);
    } else {
        console.log("Rendering at (" + pt.x + ", " + pt.y + ")");
    }

    callback(x, y);
}