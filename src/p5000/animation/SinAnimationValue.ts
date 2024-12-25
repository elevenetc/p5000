class SinAnimationValue {
  private angle: number = 0;
  private step: number = Math.PI / 20; // Default step for animation speed
  private target: number = 0;
  private cycles: number = 1;
  private active: boolean = false;
  private fade: boolean = false;

  constructor(
    target: number,
    step: number,
    cycles: number,
    fade: boolean
  ) {
    this.target = target;
    this.step = step;
    this.cycles = cycles;
    this.fade = fade;
  }

  setTarget(
    target: number
  ) {
    if (this.active) return;
    this.target = target;
    this.angle = 0;
    this.active = true;
  }

  calculate(): number {
    if (!this.active) {
      return 0;
    }

    const value = this.target * Math.sin(this.angle);
    this.angle += this.step;

    let totalAngle = Math.PI * this.cycles;
    if (this.angle >= totalAngle) {
      this.active = false;
      this.target = 0;
      this.angle = 0;
    }

    if (this.fade) {
      const fade = this.fadeValue(this.angle, totalAngle)

      return value * fade;
    } else {
      return value;
    }
  }

  /**
   * Returns value from 1 to 0
   */
  private fadeValue(current: number, target: number): number {
    return 1 - current / target;
  }
}

export default SinAnimationValue;
