import {AnimationValue, Ease} from '../src/p5000/animation/AnimationValue';

describe('AnimationValue', () => {
    let currentTime: number;

    beforeEach(() => {
        currentTime = 0;
        // Mock Date.now() to control time in tests
        jest.spyOn(Date, 'now').mockImplementation(() => currentTime);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initial state', () => {
        const animation = new AnimationValue(10);
        expect(animation.calculate()).toBe(10);
        expect(animation.isActive()).toBe(false);
    });

    test('linear animation', () => {
        const animation = new AnimationValue(0);
        animation.setEasing(Ease.LINEAR);
        animation.setDuration(1000); // 1 second
        animation.setValue(100);

        // Start of animation
        expect(animation.calculate()).toBe(0);
        expect(animation.isActive()).toBe(true);

        // Middle of animation (500ms)
        currentTime = 500;
        expect(animation.calculate()).toBeCloseTo(50, 1);
        expect(animation.isActive()).toBe(true);

        // End of animation (1000ms)
        currentTime = 1000;
        expect(animation.calculate()).toBe(100);
        expect(animation.isActive()).toBe(false);
    });

    test('in-out easing animation', () => {
        const animation = new AnimationValue(0);
        animation.setEasing(Ease.IN_OUT);
        animation.setDuration(1000);
        animation.setValue(100);

        // Start of animation
        expect(animation.calculate()).toBe(0);

        // Early in animation (250ms) - should be less than linear due to slow start
        currentTime = 250;
        const quarterProgress = animation.calculate();
        expect(quarterProgress).toBeLessThan(25);

        // Middle of animation (500ms) - should be around 50
        currentTime = 500;
        expect(animation.calculate()).toBeCloseTo(50, 1);

        // Late in animation (750ms) - should be more than linear due to slow end
        currentTime = 750;
        const threeQuarterProgress = animation.calculate();
        expect(threeQuarterProgress).toBeGreaterThan(75);

        // End of animation
        currentTime = 1000;
        expect(animation.calculate()).toBe(100);
    });

    test('addValue method', () => {
        const animation = new AnimationValue(50);
        animation.setDuration(1000);

        animation.addValue(30);
        expect(animation.isActive()).toBe(true);

        // Middle of animation
        currentTime = 500;
        expect(animation.calculate()).toBeCloseTo(65, 1);

        // End of animation
        currentTime = 1000;
        expect(animation.calculate()).toBe(80);
    });

    test('animation completes early when reaching target', () => {
        const animation = new AnimationValue(0);
        animation.setDuration(2000);
        animation.setValue(100);

        currentTime = 2001; // Slightly over duration
        expect(animation.calculate()).toBe(100);
        expect(animation.isActive()).toBe(false);
    });
});