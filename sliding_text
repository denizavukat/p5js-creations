let font; 
let pg; 


// For saving frames
let saving = false; 
let fRate = 1;

function calculateFrames(scnds,fps){
  return scnds * fps;
}

function zeroFill( number, width ){
  if ( number.toString().length >= width )
    return number;
  return ( new Array( width ).join( '0' ) + number.toString() ).substr( -width );
}


function preload() {
  font = loadFont("Roboto-Black.ttf"); // Load font
}


// Preload the font
function setup() {
  if(saving) frameRate(fRate); 
  createCanvas(1920*0.5, 1080*0.5); // Main canvas

  // Create a graphics buffer for rendering text
  pg = createGraphics(1650, 700)
  pg.textSize(300); 
}


function draw() {
  background(0); // Clear the canvas
  
  // Update the graphics buffer
  pg.textFont(font);
  pg.background(0); // Clear buffer
  pg.fill(255); 
  pg.textSize(400);
  

// Write text in the graphics buffer  
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2 -105); // Translate within the pg buffer
  pg.textAlign(CENTER, CENTER);
  //pg.text("is in", 0, 0); // Draw text at the transformed center
  pg.text("TYPES", 0, 0);
  pg.pop();
  
  
  
  
  // Define the grid for slicing the graphics buffer
  let tilesX = 80; // horizontally
  let tilesY = 80; // vertically
  let tileW = width / tilesX;
  let tileH = height / tilesY;

  // Loop through each grid cell
  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {

      // Choose from 2 different effect using sine waves
      let wave;
      
      // Wavy effect
      wave = int(sin(frameCount * 0.1+ (x*y)*0.01) * 20);
      
      //Mozaic effects
      //wave = int(sin(frameCount * 0.1 + (x*y))*30);
      
      
      if (wave < 0){
        wave = wave * (1);
      }
      
      //Comment this first source and destination couples for "TYPES" text
      // Source coordinates (floating effect)
      let sx = x * tileW + frameCount*2 + wave;
      let sy = y * tileH  + wave; 
      let sw = tileW +  frameCount*2 + wave; 
      let sh = tileH + frameCount*2 + wave; 

      
      // Destination coordinates
      let dx = x * tileW;
      let dy = y * tileH;
      let dw = tileW;
      let dh = tileH;
      
      // Source coordinates (with sliding in X axis)
      let sx1 = x * tileW + frameCount*2 + wave;
      let sy1 = y * tileH; 
      let sw1 = tileW ; 
      let sh1 = tileH; 

      
      // Destination coordinates
      let dx1 = x * tileW;
      let dy1 = y * tileH;
      let dw1 = tileW;
      let dh1 = tileH;


      //Apply both effects by copying portions of the graphics buffer to the canvas

      copy(pg, sx1, sy1, sw1, sh1, dx1, dy1, dw1, dh1);
      
      // Comment this one for "TYPES"text
      copy(pg, sx, sy, sw, sh, dx, dy, dw, dh);
      
    }
    
    
  }
  
  // Code snippet for saving frames
  let playFPS = 60; // keep 60 fps as is. It is the video playback fps. Change the duration in seconds
  let tFrames = 600; //calculates the total number of frames, params: sec and fps in order
  let fLengthMax = str(tFrames).length;
    if(frameCount <= tFrames && saving){
    let rTime = (tFrames-frameCount)/fRate;
    let fName = "frame"+frameCount+".jpg";
    fName = fName.replace(/\d+/g,function(x){ return zeroFill(parseInt(x),fLengthMax) });
    console.log("Exporting: frame"+frameCount+".jpg : " + rTime + " sec remaining");
    save(fName);
  }
}
