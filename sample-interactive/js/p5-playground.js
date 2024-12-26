import p5 from 'p5';

function setup() {
  // Create a canvas of 600x400 pixels
  createCanvas(600, 400);
  // Set the background color to light gray
  background(220);
}

function draw() {
  // Set the fill color to blue
  fill(0, 0, 255);
  // Draw an ellipse at the mouse position with a diameter of 50 pixels
  ellipse(mouseX, mouseY, 50, 50);
}
