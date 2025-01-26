import {ImageButton} from "../button/ImageButton";
import p5 from "p5";
import {Free, WrapContent} from "../containers/Free";
import {drawDebugViewRect} from "../debug/drawDebugViewRect";

export enum Direction {
    Up,
    Down,
    Left,
    Right
}

export class NavigationView extends Free {
    private readonly upButton: ImageButton;
    private readonly downButton: ImageButton;
    private readonly leftButton: ImageButton;
    private readonly rightButton: ImageButton;
    private clickHandler: ((direction: Direction) => void) | null = null;

    constructor(
        upImagePath: string,
        downImagePath: string,
        leftImagePath: string,
        rightImagePath: string
    ) {
        super();
        this.upButton = new ImageButton(upImagePath);
        this.downButton = new ImageButton(downImagePath);
        this.leftButton = new ImageButton(leftImagePath);
        this.rightButton = new ImageButton(rightImagePath);

        this.clickable = true
        this.setScale(new WrapContent()) //TODO: replace with custom scale
        this.setupButtons();
    }

    setClickHandler(handler: (direction: Direction) => void) {
        this.clickHandler = handler;
    }

    layout(p: p5) {
        super.layout(p);

        const centerX = this.getX(p);
        const centerY = this.getY(p);

        // Up button
        this.upButton.layout(p);
        this.upButton.setX(centerX + (this.upButton.getWidth(p) / 2));
        this.upButton.setY(centerY);

        // Down button
        this.downButton.layout(p);
        this.downButton.setX(centerX + (this.downButton.getWidth(p) / 2));
        this.downButton.setY(centerY + this.upButton.getHeight(p) * 2);

        // Left button
        this.leftButton.layout(p);
        this.leftButton.setX(centerX);
        this.leftButton.setY(centerY + this.upButton.getHeight(p));

        // Right button
        this.rightButton.layout(p);
        this.rightButton.setX(centerX + this.leftButton.getWidth(p));
        this.rightButton.setY(centerY + this.upButton.getHeight(p));
    }

    render(p: p5) {
        super.render(p);
        drawDebugViewRect(this, p)
    }

    getWidth(p: p5): number {
        return this.leftButton.getWidth(p) + this.rightButton.getWidth(p);
    }

    getHeight(p: p5): number {
        return this.upButton.getHeight(p) + this.downButton.getHeight(p) + this.leftButton.getHeight(p);
    }

    handleClick(mouseX: number, mouseY: number, p: p5): boolean {
        return super.handleClick(mouseX, mouseY, p);
    }

    private setupButtons() {
        this.upButton.clickListener = () => this.clickHandler?.(Direction.Up);
        this.downButton.clickListener = () => this.clickHandler?.(Direction.Down);
        this.leftButton.clickListener = () => this.clickHandler?.(Direction.Left);
        this.rightButton.clickListener = () => this.clickHandler?.(Direction.Right);
        this.addChild(this.upButton);
        this.addChild(this.downButton);
        this.addChild(this.leftButton);
        this.addChild(this.rightButton);
    }
}
