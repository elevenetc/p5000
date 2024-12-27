import TextView from "./TextView";
import p5 from "p5";

interface TextOverlay {
    render(view: TextView, p: p5)
}

export default TextOverlay