class LinearAnimationValue {
  private target: number = -1;
  private current: number;
  step: number;

  private min: number = -1;
  private max: number = -1;

  constructor(current: number, step: number, min: number, max: number) {
    this.current = current;
    this.step = step;
    this.min = min;
    this.max = max;
  }

  setTarget(target: number, step: number = this.step) {
    if(this.target == target) return;
    this.target = target;
    this.step = step;
  }

  setCurrent(current: number) {
    if(this.current == current) return;
    this.current = current;
    this.target = current;
  }

  calculate(): number {
    if (this.target == this.current || this.target == -1) {
      return this.current;
    }
    if (this.current < this.target) {
      this.current += this.step;

      if(this.current > this.target || this.current > this.max) {
        //avoid going outside target/min bound
        this.current = this.target;
      }

    } else {
      this.current -= this.step;

      if(this.current < this.target || this.current < this.min) {
        //avoid going outside target/min bound
        this.current = this.target;
      }
    }

    return this.current;
  }
}

export default LinearAnimationValue;
