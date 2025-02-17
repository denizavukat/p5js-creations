let fonts = []; // Array to store multiple fonts
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Random letters to choose from
let gridSize = 9; // Grid size
let cellWidth, cellHeight; // Dimensions of each grid cell
let gridData = []; // Stores data for each grid cell, including letters and interpolation info

// To Save:
let saving = true; 
let fRate = 1; 

function calculateFrames(scnds,fps){
  return scnds * fps;
}

function zeroFill( number, width ){
  if ( number.toString().length >= width )
    return number;
  return ( new Array( width ).join( '0' ) + number.toString() ).substr( -width );
}

// Preload function to load multiple fonts
function preload() {
  fonts.push(loadFont("fonts/.54987.otf"));
  fonts.push(loadFont("fonts/.57401.otf"));
  fonts.push(loadFont("fonts/.44256.otf")); 
  fonts.push(loadFont("fonts/.55570.otf")); 
  fonts.push(loadFont("fonts/.54007.otf")); 
  fonts.push(loadFont("fonts/.43138.otf")); 
}

function setup() {
  createCanvas(1920 * 0.5, 1080 * 0.5);
  if(saving) frameRate(fRate); 
  
  // Calculate gridcell dimensions
  cellWidth = width / gridSize;
  cellHeight = height / gridSize;

  // Initialize random letters and their points for each cell
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let letter1 = random(letters.split("")); // Select a random letter
      let letter2 = random(letters.split("")); // Select another random letter

      // Randomly pick two fonts for the transition
      let font1 = random(fonts);
      let font2 = random(fonts);

      // Generate point data for both letters
      let points1 = font1.textToPoints(letter1, 0, 0, 100, { sampleFactor: 0.2 });
      let points2 = font2.textToPoints(letter2, 0, 0, 100, { sampleFactor: 0.2 });

      // Ensure both point arrays have the same length
      normalizePoints(points1, points2);

      // Store data for this cell
      gridData.push({
        x: x,
        y: y,
        points1: points1,
        points2: points2,
        interpolatedPoints: points1.map((p) => ({ x: p.x, y: p.y })),
        progress: 0,
        direction: 1, // Direction of morphing (1 for forward, -1 for reverse)
        
      });
    }
  }
}

function draw() {
  background(0);

  // Draw each letter morphing in its grid cell
  for (let cell of gridData) {
    let { x, y, points1, points2, interpolatedPoints, progress, direction } = cell;

    // Update interpolation
    for (let i = 0; i < points1.length; i++) {
      interpolatedPoints[i].x = lerp(points1[i].x, points2[i].x, progress);
      interpolatedPoints[i].y = lerp(points1[i].y, points2[i].y, progress);
    }

    // Draw interpolated points şn the cell
    push();
    translate(
      x * cellWidth + cellWidth / 2 - 50,
      y * cellHeight + cellHeight / 2 + 30
    );
    fill(255);
    noStroke();
    beginShape();
    for (let point of interpolatedPoints) {
      vertex(point.x, point.y);
    }
    endShape(CLOSE);
    pop();

    // Update progress for animation
    cell.progress += 0.01 * direction; 
    if (cell.progress > 1 || cell.progress < 0) {
      cell.direction *= -1; // Reverse direction at limits
    }
  }
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

// Function to ensure both point arrays have the same length
function normalizePoints(points1, points2) {
  const maxLength = Math.max(points1.length, points2.length);

  while (points1.length < maxLength) {
    points1.push(points1[points1.length - 1]); // Duplicate the last point
  }
  while (points2.length < maxLength) {
    points2.push(points2[points2.length - 1]); // Duplicate the last point
  }
}
