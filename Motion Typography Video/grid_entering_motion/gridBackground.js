
// Class for managing and drawing the background grid

class GridBackground {
  constructor(spacing, lineColor) {
    this.spacing = spacing; // Spacing between grid lines
    this.lineColor = lineColor; // Color of the grid lines
    this.scaleFactor = 0; // Initial scale of the grid
    this.maxScale = 1; // Maximum scale to reach
    this.growthSpeed = 0.01; // Speed of scaling
    this.position = createVector(width / 2, height / 2); // Position of the grid
  }

  draw() {
    push();
    stroke(this.lineColor);
    strokeWeight(1);
    noFill();

    // Increment scale factor for animation
    if (this.scaleFactor < this.maxScale) {
      this.scaleFactor += this.growthSpeed;
    }

    // Translate to the grid position and apply scaling
    translate(this.position.x, this.position.y);
    scale(this.scaleFactor);

    // Perspective effect for the grid
    rotateX(-PI / 4); // Tilt the grid
    rotateY(PI / 4);

    // Draw grid lines as two walls for depth
    for (let z = -800; z <= 1500; z += this.spacing) {
      beginShape();
      for (let x = -800; x <= 1500; x += this.spacing) {
        vertex(x, z, -800); // Back wall
      }
      endShape();
    }

    for (let x = -800; x <= 1000; x += this.spacing) {
      beginShape();
      for (let z = -800; z <= 1000; z += this.spacing) {
        vertex(x, z, -400); // Front wall
      }
      endShape();
    }

    pop();
  }

  setPosition(x, y) {
    this.position.set(x, y);
  }

  resetScale() {
    this.scaleFactor = 0; // Reset the scaling factor
  }
}
