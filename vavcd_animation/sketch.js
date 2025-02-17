let bg; // Background object
let f; // Font
let simplex; // Simplex noise object
let textPoints = [];
let currentPoints = [];
let circleColors = []; 
let loadedColors = [];
let animationProgress = 0; 
let resetTimestamp = null; 

let saving = false; //change to true when ready to start snapshoting
let fRate = 1; //recommended frameRate to avoid dropped frames is one - dont change


function calculateFrames(scnds,fps){
  return scnds * fps;
}

function zeroFill( number, width ){
  if ( number.toString().length >= width )
    return number;
  return ( new Array( width ).join( '0' ) + number.toString() ).substr( -width );
}

function preload() {
  f = loadFont("assets/Roboto-Black.ttf"); // Load your font
  const colorData = loadJSON('assets/colors.json', (data) => {
    for (let i = 0; i < data.length; i++) {
      let h = data[i].h;
      let s = data[i].s;
      let br = data[i].br;
      colorMode(HSB, 360, 100, 100);
      let c = color(h, s, br);
      loadedColors.push(c);
    }
  });
}

function setup() {
  pixelDensity(2);
  createCanvas(1920, 1080);
  if(saving) frameRate(fRate); 
  bg = new LetterBackground(loadedColors);
  noStroke();
  simplex = new SimplexNoise();
  colorMode(HSB);
  //let textWidthValue = f.textWidth('VAVCD');

  // Generate target points for "VAVCD"
  textPoints = f.textToPoints('VAVCD', width / 2 - 400, height / 2+80, 250, {
    sampleFactor: 0.6,
    
  });

  // Initialize current points with random positions
  for (let i = 0; i < textPoints.length; i++) {
    currentPoints.push({
      x: random(width),
      y: random(height),
    });
  }
}

function draw() {
  background(0); 

  // Increment animation progress
  animationProgress = min(animationProgress + 0.005, 1);

  // Update the letters to show based on animation progress
  bg.updateProgress(animationProgress);

  // Draw the animated background
  push();
  bg.draw();
  circleColors = bg.colors;
  pop();

  // Draw transitioning dots forming VAVCD
  drawTransitioningDots();
  let playFPS = 60; // keep 60 fps as is. It is the video playback fps. Change the duration in seconds
  let tFrames = calculateFrames(5,playFPS); //calculates the total number of frames, params: sec and fps in order
  let fLengthMax = str(tFrames).length;//max number of digits
  
  if(frameCount <= tFrames && saving){
    let rTime = (tFrames-frameCount)/fRate;
    let fName = "frame"+frameCount+".jpg";
    fName = fName.replace(/\d+/g,function(x){ return zeroFill(parseInt(x),fLengthMax) });
    console.log("Exporting: frame"+frameCount+".jpg : " + rTime + " sec remaining");
    save(fName);
  }
}

function drawTransitioningDots() {
  animationProgress = min(animationProgress + 0.002, 1); // Increment progress (0 to 1)

  for (let i = 0; i < textPoints.length; i++) {
    let target = textPoints[i];
    let current = currentPoints[i];

    // Add noise-based movement during the transition
    let nx = current.x + simplex.noise3D(current.x * 0.01, current.y * 0.01, frameCount * 0.0001) * (1 - animationProgress * 0.001) * 100;
    let ny = current.y + simplex.noise3D(current.y * 0.01, current.x * 0.01, frameCount * 0.0001) * (1 - animationProgress * 0.001) * 100;

    // Interpolate towards the target position
    current.x = lerp(nx, target.x, animationProgress);
    current.y = lerp(ny, target.y, animationProgress);

    // Color based on circleColors or fallback
    let c = circleColors[i % circleColors.length] || color(255, 100, 100);

    fill(c);
    noStroke();
    circle(current.x, current.y, 15 * (animationProgress)); // Draw each point
  }

  // Restart animation if complete
  if (animationProgress === 1) {
    if (!resetTimestamp) {
      resetTimestamp = millis(); // Set the reset timestamp
    }

    if (millis() - resetTimestamp >= 2000) { // Check if 2 seconds have passed
      resetAnimation();
      resetTimestamp = null; // Reset the timestamp
    }
  }
}

function resetAnimation() {
  animationProgress = 0;
  for (let i = 0; i < currentPoints.length; i++) {
    currentPoints[i] = {
      x: random(width),
      y: random(height),
    };
  }
}
