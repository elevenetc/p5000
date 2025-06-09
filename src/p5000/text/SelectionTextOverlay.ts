import TextOverlay from "./TextOverlay";
import TextView from "./TextView";
import p5 from "p5";
import {Backspace, Escape, KeyboardHandler, KeyChar} from "../keyboard/KeyboardHandler";
import {dropLastChar} from "../utils/stringUtils";

class SelectionTextOverlay implements TextOverlay {

    selection: string = ""

    constructor(keyboardHandler: KeyboardHandler) {
        keyboardHandler.addListener(keyValue => {
            if (keyValue instanceof Backspace) {
                this.selection = dropLastChar(this.selection)
            } else if (keyValue instanceof Escape) {
                this.selection = ""
            } else if (keyValue instanceof KeyChar) {
                this.selection += keyValue.char
            }
        })
    }

    render(view: TextView, p: p5): void {
        const intersections = getIntersections(view.title, this.selection)
        if (intersections.length > 0) {
            console.log("found intersections: " + intersections.length)
        }
        intersections.forEach(intersection => {
            const prefix = intersection.prefix
            const postfix = intersection.postfix
            const match = intersection.match
            const textHeight = view.getHeight(p);
            const padding = textHeight / 10;
            const x = view.getX(p) + p.textWidth(prefix) - padding
            const y = view.getY(p) + padding
            const width = p.textWidth(match) + padding * 2

            const height = textHeight
            p.push()
            p.blendMode("difference")
            p.fill(255, 255, 255)
            p.rect(x, y, width, height)
            p.pop()
        })
    }
}

function getIntersections(str: string, search: string): SearchGroup[] {

    if (search.length > str.length) return []
    if (search.length == 0) return []
    if (str.length == 0) return []

    const result: SearchGroup[] = [];
    let startIndex = 0;

    while (startIndex < str.length) {
        const index = str.toLowerCase().indexOf(search.toLowerCase(), startIndex);
        if (index === -1) break;

        const prefix = str.substring(0, index);
        const match = search;
        const postfix = str.substring(index + search.length);

        result.push({prefix, match, postfix});

        // Move to the next character after the current match
        startIndex = index + 1;
    }

    return result;
}

class SearchGroup {
    prefix: string
    match: string
    postfix: string
}

export default SelectionTextOverlay