import p5 from "p5";

export function getTextHeight(textSize: number, p: p5): number {
    p.push()
    if (textSize != -1) p.textSize(textSize)
    let h = p.textAscent() + p.textDescent()
    p.pop()
    return h
}