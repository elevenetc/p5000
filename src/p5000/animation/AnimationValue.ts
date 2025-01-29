export enum Ease {
    LINEAR,
    IN_OUT,
}

export class AnimationValue {
    private current: number = 0;
    private target: number = 0;
    private initialValue: number = 0;
    private progress: number = 0;
    private easing: Ease = Ease.LINEAR;
    private duration: number = 1000; // ms
    private startTime: number = 0;
    private isAnimating: boolean = false;

    constructor(initialValue: number = 0) {
        this.current = initialValue;
        this.target = initialValue;
    }

    setEasing(easing: Ease) {
        this.easing = easing;
    }

    setDuration(duration: number) {
        this.duration = duration;
    }

    addValue(value: number) {
        this.target = this.current + value;
        this.startAnimation();
    }

    getTarget(): number {
        return this.target
    }

    setValue(value: number, animate: boolean = true) {

        if (animate) {
            this.target = value;
            this.startAnimation();
        } else {
            this.target = value;
            this.current = value;
        }
    }

    calculate(): number {
        if (!this.isAnimating) return this.current;

        const currentTime = Date.now();
        this.progress = Math.min((currentTime - this.startTime) / this.duration, 1);

        if (this.progress >= 1) {
            this.current = this.target;
            this.isAnimating = false;
            return this.current;
        }

        const easedProgress = this.getEasedProgress(this.progress);
        this.current = this.initialValue + (this.target - this.initialValue) * easedProgress;
        return this.current;
    }

    isActive(): boolean {
        return this.isAnimating;
    }

    private startAnimation() {
        this.isAnimating = true;
        this.startTime = Date.now();
        this.progress = 0;
        this.initialValue = this.current;
    }

    private getEasedProgress(t: number): number {
        switch (this.easing) {
            case Ease.IN_OUT:
                // Quadratic ease-in-out
                return t < 0.5
                    ? 2 * t * t
                    : -2 * t * t + 4 * t - 1;
            case Ease.LINEAR:
            default:
                return t;
        }
    }

    private lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }
}
