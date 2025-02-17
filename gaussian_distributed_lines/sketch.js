let itter = 1000; // Number of vertices
let cX = [];
let cY = [];
let step;

function setup() {
  pixelDensity(2); 
  step = TWO_PI / itter;
  createCanvas(600, 600);
  noLoop(); 

  for (let i = 0; i < itter; i++) {
    cX.push(random(-width, width)); // Random X positions
    cY.push(random(-height, height)); // Random Y positions
  }
}

function draw() {
  // Draw random connections across the canvas
  beginShape();
  for (let i = 0; i < itter; i += 1) {
    strokeCap(ROUND);
    strokeJoin(ROUND);
    strokeWeight(0.5);
    stroke(0); 
    noFill();

    // Use random Gaussian and uniform distribution for dynamic connections
    let rI1 = round(randomGaussian(itter / 2, itter / 6)) % itter; // Gaussian-distributed index
    let rI2 = round(random(0, itter)) % itter; // Uniformly distributed index
    vertex(cX[rI1], cY[rI2]);
  }
  endShape();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('abstract-pattern', 'png');
  }
}
