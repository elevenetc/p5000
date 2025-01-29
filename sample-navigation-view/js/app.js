import {Free} from "../../src/p5000/containers/Free";
import TextView from "../../src/p5000/text/TextView";
import Align from "../../src/p5000/Align";
import {Direction, NavigationView} from "../../src/p5000/navigation/NavigationView";
import {initP5000} from "../../src/p5000/initP5000";
import Vertical from "../../src/p5000/Vertical";

const root = new Free()
const vertical = new Vertical()

vertical.alignContent = Align.CENTER

// Create direction text display
const directionText = new TextView("Press any direction");
directionText.color = [255, 255, 255, 255];


// Create navigation view
const navigationView = new NavigationView()

// Add click handler
navigationView.setClickHandler((direction) => {
    switch (direction) {
        case Direction.Up:
            directionText.setText("UP pressed");
            break;
        case Direction.Down:
            directionText.setText("DOWN pressed");
            break;
        case Direction.Left:
            directionText.setText("LEFT pressed");
            break;
        case Direction.Right:
            directionText.setText("RIGHT pressed");
            break;
    }
});

vertical.addChild(directionText)
vertical.addChild(navigationView)
root.addChild(vertical, Align.CENTER)

initP5000(root)