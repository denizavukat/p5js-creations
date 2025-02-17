let time = 0; 
let itter = 1000; // Number of vertices for the circle
let r = 150; // Radius of the circle
let cX = [];
let cY = [];
let step;

function setup() {
  pixelDensity(2);
  createCanvas(550, 850);
  step = TWO_PI / itter;

  // Precompute circle vertices
  for (let i = 0; i < itter; i++) {
    cX.push(cos(step * i) * r);
    cY.push(sin(step * i) * r);
  }

  noStroke();
  frameRate(60); 
}

function draw() {
  background(0); // Black background for better neon effect
 
  const G = 10; // Grid spacing
  const M = 5; // Margin

  const rows = (height - 2 * M) / G + 1;
  const cols = (width - 2 * M) / G + 1;

 
  for (let i = 0; i < rows; i++) {
    const y = M + i * G;

    const odd = i & 1; // Alternate rows
    for (let j = 0; j < cols; j++) {
      let j0 = odd ? cols - j - 1 : j;

      // Introduce Perlin noise-based movement to the position
      let xBase = M + (odd ? cols - j - 5 / 4 : j - 1 / 4) * G;
      let yBase = y;

      let xOffset = map(noise(j0 / 10, i / 10, time), 0, 1, -5, 5); // Horizontal wobble
      let yOffset = map(noise(i / 10, j0 / 10, time), 0, 1, -5, 5); // Vertical wobble
      let x = xBase + xOffset;
      let yDynamic = yBase + yOffset;

      let size = getPerlinValue(j0, i, time); 
      size = constrain(size, 0.3, 1.0); // Clamp size to avoid overly small or large circles

      if (size <= 0) continue;

      // Dynamically shift colors using Perlin noise
      let hue = map(noise(j0 / 10, i / 10, time + 5), 0, 1, 0, 360); 
      // Larger circles are more saturated and brighter
      let saturation = map(size, 0.3, 1.0, 50, 100); 
      let brightness = map(size, 0.3, 1.0, 70, 100); 
      
      // Draw the circle
      push();
      colorMode(HSB, 360, 100, 100, 100); 
      let c = color(hue, saturation, brightness, 80); 
      fill(c);
      ellipse(x, yDynamic, size * G, size * G); 
      pop();
    }
  }

  time += 0.02;

  // Draw the circular form on top
  drawCircularForm();
}

function getPerlinValue(x, y, t) {
  const s = 0.3; // Scale for spatial noise
  const timeScale = 0.1; // Scale for temporal noise
  return noise(x / s, y / s, t * timeScale); 
}

// Function to draw the circular form
function drawCircularForm() {
push();
  translate(width / 2, height / 2); // Center the circular form

  // Draw random connections inside the circle
  beginShape();
  for (let i = 0; i < itter; i++) {
    strokeCap(ROUND);
    strokeJoin(ROUND);
    stroke(255, 200); 
    strokeWeight(0.5);
    noFill();

    // Randomized connections using Gaussian distribution
   let rI1 = round(randomGaussian(20, itter))
    let rI2 = round(random(0, itter))
    vertex(cX[rI1], cY[rI1])
    push()

    fill(245)
    pop()
  }
  endShape(CLOSE); 
  pop();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('neon-pattern', 'png');
  }
}