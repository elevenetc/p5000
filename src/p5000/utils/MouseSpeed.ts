import p5 from "p5";

class MouseSpeed {
  private speeds: number[] = [];
  private maxSamples = 10;
  speed = 0;
  direction: MouseDirection = MouseDirection.UP;

  render(p: p5) {
    const dx = p.mouseX - p.pmouseX;
    const dy = p.mouseY - p.pmouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if(Math.abs(dx) > Math.abs(dy)) {
      if(dx > 0) {
        this.direction = MouseDirection.RIGHT;
      } else {
        this.direction = MouseDirection.LEFT;
      }
    } else {
      if(dy > 0) {
        this.direction = MouseDirection.DOWN;
      } else {
        this.direction = MouseDirection.UP;
      }
    }

    // Calculate the mouse speed (pixels per second)
    const mouseSpeed = (distance * 1000) / p.deltaTime;

    this.speeds.push(mouseSpeed);

    // Keep only the last `maxSamples` speeds
    if (this.speeds.length > this.maxSamples) {
      this.speeds.shift();
    }

    // Calculate the average speed
    this.speed = this.speeds.reduce((a, b) => a + b) / this.speeds.length;
  }
}

enum MouseDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export {
  MouseSpeed,
  MouseDirection
}
