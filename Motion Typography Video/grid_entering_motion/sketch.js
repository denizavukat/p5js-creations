let font;
let letters = []; // Array to store grids for each letter
let txt = "MOTION";
let fontSize = 200;
let gridSpacing = 5; // Spacing for the grid points inside each letter
let tFrames= 600;


// Frame-saving settings
let saving = false; //change to true when ready to start snapshoting
let fRate = 1; // Enable frame saving
let maxFrames = 600;


function zeroFill( number, width ){
  if ( number.toString().length >= width )
    return number;
  return ( new Array( width ).join( '0' ) + number.toString() ).substr( -width );
}

// Preload the font file

function preload() {
  font = loadFont("fonts/.44256.otf"); // Load your custom font
}

function setup() {
  createCanvas(1920*0.5, 1080*0.5,WEBGL);
  if(saving) frameRate(fRate); 

  // Process each letter to generate grid points
  let xOffset = 100;
  for (let i = 0; i < txt.length; i++) {
    let char = txt[i]; // Current letter
    let letterPoints = font.textToPoints(char, xOffset+120, 50, fontSize, {
      sampleFactor: 0.1,
    });

    // Adjust spacing dynamically based on letter width
    let bounds = getBoundingBox(letterPoints); // Get bounding box for the letter
    xOffset += bounds.maxX - bounds.minX + 10; // Add padding between letters
    
    // Create a grid of points within the letter shape
    let letterGrid = createLetterGrid(letterPoints, gridSpacing); // Create grid for the letter
    letters.push(letterGrid);
  }
  // Initialize the grid background from GridBackground class
  gridBg = new GridBackground(20, color(255));
}

function draw() {
  background(0);
  
  gridBg.draw();// Draw the dynamic grid background

  // Draw and animate grid points for each letter
  fill(255);
  noStroke();
  
  for (let grid of letters) {
    for (let p of grid) {
      // Move the points left over time
      p.x -= 2; // Slide left by reducing the x-coordinate

      // Wrap the points back to the right if they leave the canvas
      if (p.x < -10) {
        p.x = width + 10; 
      }

      // Animate the points with a waving effect
      let offsetX = sin(frameCount * 0.05 + p.y * 0.01) * 5;
      let offsetY = cos(frameCount * 0.05 + p.x * 0.01) * 5;
      let waveY = sin(frameCount * 0.05 + p.x * 0.01) * 50;
      ellipse(p.x + offsetX, p.y + offsetY + waveY, 5, 5);
    }
  }
  
  // Save frames if enabled
  let playFPS = 60; // keep 60 fps as is. It is the video playback fps. Change the duration in seconds
  let fLengthMax = str(tFrames).length;//max number of digits
  if(frameCount <= tFrames && saving){
    let rTime = (tFrames-frameCount)/fRate;
    let fName = "frame"+frameCount+".jpg";
    fName = fName.replace(/\d+/g,function(x){ return zeroFill(parseInt(x),fLengthMax) });
    console.log("Exporting: frame"+frameCount+".jpg : " + rTime + " sec remaining");
    save(fName);
  }
}

// Create a grid of points inside a letter's shape
function createLetterGrid(letterPoints, spacing) {
  let grid = [];
  let bounds = getBoundingBox(letterPoints);

   // Generate grid points within the bounding box
  for (let y = bounds.minY; y <= bounds.maxY; y += spacing) {
    for (let x = bounds.minX; x <= bounds.maxX; x += spacing) {
      if (isInsideLetter(x, y, letterPoints)) {
        grid.push(createVector(x, y));
      }
    }
  }
  return grid;
}

// Get bounding box for a letter
function getBoundingBox(points) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  // Iterate through points to find extremes
  for (let p of points) {
    minX = min(minX, p.x);
    minY = min(minY, p.y);
    maxX = max(maxX, p.x);
    maxY = max(maxY, p.y);
  }

  return { minX, minY, maxX, maxY };
}

// Check if a point is inside a letter's shape
/*
The ray-casting algorithm is a computational technique used to determine whether a point lies inside a polygon: works by casting an imaginary "ray" from the point in a specific direction and counting how many times the ray intersects the edges of the polygon. The key principle is that:

If the ray intersects the polygon's edges an odd number of times, the point is inside the polygon.
If the ray intersects an even number of times, the point is outside the polygon  
*/
function isInsideLetter(x, y, points) {
  let crossings = 0;

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    let xi = points[i].x,
      yi = points[i].y;
    let xj = points[j].x,
      yj = points[j].y;

    // Check if the point crosses the edge
    if ((yi > y) !== (yj > y)) {
      let slope = (xj - xi) / (yj - yi);
      let intersectX = xi + slope * (y - yi);

      if (x < intersectX) crossings++;
    }
  }

  // Inside if the number of crossings is odd
  return crossings % 2 !== 0;
}

