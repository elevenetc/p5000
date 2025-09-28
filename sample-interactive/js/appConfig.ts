import {lightenColor, stringToColor} from "../../src/p5000/colorUtils";


function tagTitleToColor(title: string): [number, number, number] {
    return lightenColor(stringToColor(title))
}

export {
  tagTitleToColor
}
