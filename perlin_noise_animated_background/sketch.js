let time = 0;

function setup() {
  pixelDensity(2);
  createCanvas(550, 850);
  
  noStroke();
  frameRate(60);
}

function draw() {
  background(0);

  const G = 10; // Grid spacing
  const M = 5; // Margin

  const rows = (height - 2 * M) / G + 1;
  const cols = (width - 2 * M) / G + 1;

  for (let i = 0; i < rows; i++) {
    const y = M + i * G;

    const odd = i & 1;
    for (let j = 0; j < cols; j++) {
      let j0 = odd ? cols - j - 1 : j;

      // Introduce Perlin noise-based movement to the position
      let xBase = M + (odd ? cols - j - 5 / 4 : j - 1 / 4) * G;
      let yBase = y;

      let xOffset = map(noise(j0 / 10, i / 10, time), 0, 1, -5, 5); // Horizontal wobble
      let yOffset = map(noise(i / 10, j0 / 10, time), 0, 1, -5, 5); // Vertical wobble
      let x = xBase + xOffset;
      let yDynamic = yBase + yOffset;

      // Use Perlin noise for smooth size variation
      let size = getPerlinValue(j0, i, time); // Circle size based on Perlin noise
      size = constrain(size, 0.3, 1.0); // Clamp size to avoid overly small or large circles

      if (size <= 0) continue;

      // Dynamically shift colors using Perlin noise
      let hue = map(noise(j0 / 10, i / 10, time + 5), 0, 1, 0, 360); // Hue varies over time
      let saturation = map(size, 0.3, 1.0, 50, 100); // Larger circles are more saturated
      let brightness = map(size, 0.3, 1.0, 70, 100); // Larger circles are brighter

      // Draw the circle
      push();
      colorMode(HSB, 360, 100, 100, 100); 
      let c = color(hue, saturation, brightness, 80); 
      fill(c);
      ellipse(x, yDynamic, size * G, size * G); 
      pop();
    }
  }

  time += 0.02; // Increment time for animation
}

// Function to calculate Perlin noise-based values
function getPerlinValue(x, y, t) {
  const s = 0.3; // Scale for spatial noise
  const timeScale = 0.1; // Scale for temporal noise
  return noise(x / s, y / s, t * timeScale); 
}
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('neon-pattern', 'png'); // Save the canvas as an image
  }
}