import p5 from "p5";
import {P5000Config} from "../initP5000";
import {TextButton} from "../button/TextButton";

export class CheckboxView extends TextButton {

    checkListener: (checked: boolean) => void | null = null
    private checked = false;
    private checkChar = "✅"
    private uncheckedChar = "✔️"

    constructor(
        title: string = "",
        checkListener: (checked: boolean) => void = null,
        checked: boolean = false
    ) {
        super();


        this.checked = checked;
        this.setTitle(title)
        this.setIcon();
        this.checkListener = checkListener;

        this.clickListener = () => {
            this.checked = !this.checked
            this.setIcon()
            this.checkListener?.call(this, this.checked)
        }
    }

    init(p: p5, config: P5000Config) {
        super.init(p, config);

        //this.titleView.color = config.textStyle.color
        //this.titleView.background = new ColorDrawable(config.textStyle.background)
        //this.titleView.textSize = config.textStyle.basicSize
        //this.buttonView.size = config.textStyle.basicSize
    }

    private setIcon() {
        if (this.checked) this.setEndIcon(this.checkChar)
        else this.setEndIcon(this.uncheckedChar)
    }
}
