import Vertical from "../containers/Vertical";
import {TextButton} from "../button/TextButton";

const selectedChar = "🔴"
const unselectedChar = "🔘️"

export class RadioList extends Vertical {

    items: string[]
    views: TextButton[] = []
    selectedItem: string = null


    constructor(
        items: string[],
        onItemSelected: (item: string) => void | null = null
    ) {
        super();

        this.items = items;

        items.forEach(item => {
            let textButton = new TextButton(item);
            textButton.setEndIcon(unselectedChar)
            textButton.clickListener = () => {
                this.updateSelected(item)
                onItemSelected?.call(this, item)
            }

            this.views.push(textButton)
            this.addChild(textButton)
        })

        let defaultItem = items[0]
        this.updateSelected(defaultItem)
        onItemSelected?.call(this, defaultItem)
    }

    private updateSelected(item: string) {
        this.selectedItem = item

        this.views.forEach(view => {
            if (view.getTitle() == item) {
                view.setEndIcon(selectedChar)
            } else {
                view.setEndIcon(unselectedChar)
            }

        })
    }
}
