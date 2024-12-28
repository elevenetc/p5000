import View from "../View";
import p5 from "p5";

function printViewInfo(view: View, p: p5) {
    const viewType = view.constructor.name; // Get the class name as the type
    const x = view.getX(p); // Assuming View has an x property
    const y = view.getY(p); // Assuming View has a y property
    const width = view.getWidth(p); // Assuming View has a width property
    const height = view.getHeight(p); // Assuming View has a height property

    console.log(`View Info:
    Type: ${viewType}
    x: ${x}, y: ${y}
    w: ${width}, h: ${height}`);
}

export {
    printViewInfo
}