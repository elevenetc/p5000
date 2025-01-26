import View from "../View";
import p5 from "p5";

class ImageButton extends View {

    private readonly imagePath: string;
    private image: any | null = null
    private loading: boolean = false;

    constructor(imagePath: string) {
        super();
        this.clickable = true
        this.imagePath = imagePath;
    }

    getWidth(p: p5): number {
        if (this.image == null) return 0;
        else return this.image.width;
    }

    getHeight(p: p5): number {
        if (this.image == null) return 0;
        else return this.image.height;
    }

    layout(p: p5) {
        super.layout(p);

        if (!this.loading) {
            this.loading = true
            p.loadImage(this.imagePath, (image) => {
                this.image = image;
            }, (error) => {
                console.log("image loading error", error)
            });
        }
    }

    render(p: p5) {
        if (this.image == null) return
        super.render(p);
        p.push()
        p.image(this.image, this.getX(p), this.getY(p))
        p.pop()
    }
}

export {
    ImageButton
}