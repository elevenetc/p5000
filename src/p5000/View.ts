import Align from "./Align";
import p5 from "p5";
import LinearAnimationValue from "./animation/LinearAnimationValue";

class View {

  id?: string;

  align?: Align

  parent?: View;

  alpha: LinearAnimationValue = new LinearAnimationValue(255, 30, 0, 255);

  hover: boolean = false;

  x: number;
  y: number;

  hoverHandler: (id: string, hovered: boolean, p: p5) => void;

  setAlpha(value: number, step: number = this.alpha.step, animate: boolean = false) {
    if(animate){
      this.alpha.setTarget(value)
    }else{
      this.alpha.setCurrent(value)
    }
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  setX(x: number) {
    this.x = x;
  }

  setY(y: number) {
    this.y = y;
  }

  getWidth(p: p5): number {
    throw new Error("getWidth not implemented.");
  }

  getHeight(p: p5): number {
    throw new Error("getHeight not implemented.");
  }

  render(p: p5): void {
    throw new Error("draw not implemented.");
  }

  onHoverIn(p: p5): void {
    this.hoverHandler?.(this.id, true, p)
  }

  onHoverOut(p: p5): void {
    this.hoverHandler?.(this.id, false, p)
  }

  contains(x: number, mouseY: number, p: p5): boolean {
    throw new Error(`${this.constructor.name}.contains not implemented.`);
  }

  handleHover(mouseX: number, mouseY: number, p: p5): boolean {
    let result = false;
    if (this.contains(mouseX, mouseY, p)) {

      if (!this.hover) {
        this.hover = true;
        this.onHoverIn(p);
      }

      result = true;
    } else {
      if (this.hover) {
        this.hover = false;
        this.onHoverOut(p);
      }
    }
    return result;
  }
}

export default View;
