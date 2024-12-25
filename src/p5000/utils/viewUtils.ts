import p5 from "p5";
import View from "../View";

function handleChildrenHover(children: View[], mouseX: number, mouseY: number, p: p5): boolean {
  let result = false;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.handleHover(mouseX, mouseY, p)) {
      result = true;
    }
  }
  return result;
}

export {handleChildrenHover}
