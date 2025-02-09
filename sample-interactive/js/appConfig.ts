import {lightenColor, stringToRgb} from "../../src/p5000/colorUtils";


function tagTitleToColor(title: string): [number, number, number] {
  return lightenColor(stringToRgb(title))
}

export {
  tagTitleToColor
}
