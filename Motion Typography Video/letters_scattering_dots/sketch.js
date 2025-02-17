let font; 
let textPoints = []; // Target points representing the text
let currentPoints = []; // Current positions of dots in the animation
let animationProgress = 0; // Animation progress (0 to 1)
let resetTimestamp = null; // Timestamp to track animation reset

let saving = false; 
let fRate = 1; 
function calculateFrames(scnds, fps) {
  return scnds * fps;
}
function zeroFill(number, width) {
  if (number.toString().length >= width) return number;
  return (new Array(width).join('0') + number.toString()).substr(-width);
}

// Preload the font "Bilbo ExtraBold"
function preload() {
  font = loadFont(".44256.otf"); 
}

function setup() {
  createCanvas(1920 * 0.5, 1080 * 0.5); 
  if (saving) frameRate(fRate); 
  
  noStroke(); // Disable stroke for the circles

  // Generate target points for the text "LETTERS"
  textPoints = font.textToPoints('LETTERS', 60, 320, 200, {
    sampleFactor: 0.5, 
  });

  // Initialize the starting positions of the dots to random coordinates
  for (let i = 0; i < textPoints.length; i++) {
    currentPoints.push({
      x: random(width), // Random x-coordinate
      y: random(height), // Random y-coordinate
    });
  }
}

function draw() {
  background(0); 

  // Increment the animation progress (approaching 1)
  animationProgress = min(animationProgress + 0.005, 1);

  // Draw the animated dots transitioning to form the text
  drawTransitioningDots();

  // Restart animation after a 2 seconds delay once it's completed
  if (animationProgress === 1) {
    if (!resetTimestamp) {
      resetTimestamp = millis(); 
    }

    // Reset the animation after 2 seconds
    if (millis() - resetTimestamp >= 2000) {
      resetAnimation(); 
      resetTimestamp = null; 
    }
  }

  // Saving frames 
  let playFPS = 60; // Playback frame rate
  let tFrames = calculateFrames(5, playFPS); // Total frames for 5 seconds of playback
  let fLengthMax = str(tFrames).length; 
  if (frameCount <= tFrames && saving) {
    let rTime = (tFrames - frameCount) / fRate; 
    let fName = "frame" + frameCount + ".jpg"; 
    fName = fName.replace(/\d+/g, function (x) {
      return zeroFill(parseInt(x), fLengthMax); // Zero-pad the frame number
    });
    console.log("Exporting: " + fName + " : " + rTime.toFixed(2) + " sec remaining");
    save(fName); 
  }
}

// Function to draw dots transitioning from random positions to target positions
function drawTransitioningDots() {
  // Loop through each target point
  for (let i = 0; i < textPoints.length; i++) {
    let target = textPoints[i]; 
    let current = currentPoints[i]; 

    // Add Perlin noise-based movement during the transition
    let nx = current.x + noise(current.x * 0.01, current.y * 0.01, frameCount * 0.01) * 10;
    let ny = current.y + noise(current.y * 0.01, current.x * 0.01, frameCount * 0.01) * 10;

    // Linearly interpolate towards the target position
    current.x = lerp(nx, target.x, animationProgress);
    current.y = lerp(ny, target.y, animationProgress);

    // Draw the current point as a white circle
    fill(255);
    circle(current.x, current.y, 5); // Circle size of 5 pixels
  }
}

// Function to reset the animation and randomize the dot positions
function resetAnimation() {
  animationProgress = 0; // Reset the animation progress to 0
  // Randomize the current positions of all dots
  for (let i = 0; i < currentPoints.length; i++) {
    currentPoints[i] = {
      x: random(width), 
      y: random(height), 
    };
  }
}
