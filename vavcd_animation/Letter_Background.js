class LetterBackground {
  constructor(colors) {
    this.letters = ["V", "A", "V", "C", "D"];
    this.colors = colors;
    this.time = 0; 
    this.timeIncrement = 0.02; background animation
    this.textToShow = []; // Holds the letters that should be visible
    this.totalLetters = [
      " ",
      "V",
      "I",
      "S",
      "U",
      "A",
      "L",
      " ",
      "A",
      "R",
      "T",
      "S",
      " ",
      "A",
      "N",
      "D",
      " ",
      "C",
      "O",
      "M",
      "M",
      "U",
      "N",
      "I",
      "C",
      "A",
      "T",
      "I",
      "O",
      "N",
      " ",
      "D",
      "E",
      "S",
      "I",
      "G",
      "N",
      " "
    ]; // Full string of "Visual Arts and Communication Design"
  }

  updateProgress(animationProgress) {
    // Determine how many letters should be visible based on animation progress
    const numLettersToShow = Math.floor(
      animationProgress * 1.5 * this.totalLetters.length
    );
    this.textToShow = this.totalLetters.slice(0, numLettersToShow);
  }

  draw() {
    let index = 0; // Index to keep track of visible letters in `textToShow`
    for (let y = 0; y <= height; y += 40) {
      for (let x = 0; x <= width; x += 21) {
        push();
        translate(x, y);

        let colorIndex = int(
          noise(x * 0.1, y * 0.1, this.time) * this.colors.length
        );
        colorIndex = constrain(colorIndex, 0, this.colors.length - 1);
        fill(this.colors[colorIndex]);

        // Row 8 between indexes 6 and 43
        if (y === 17 * 40 && x >= 27 * 21 && x <= 66 * 21) {
          if (index < this.textToShow.length) {
            text(this.textToShow[index], 20, 0); // Draw visible letters
            index++;
          }
        } else {
          // Draw random letters elsewhere
          let c = this.colors[colorIndex];
          let brightValue = map(brightness(c),0,255,0,100);
          let hueValue = hue(c);
          let satValue = saturation(c);
          fill(hueValue, satValue, brightValue);
          text(random(this.letters), 0, 0);
        }

        pop();
      }
    }

    // Increment time for animation
    this.time += this.timeIncrement;
  }
}
