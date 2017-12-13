function setup() {
  createCanvas(1000, 800);
  frameRate(10);
  size_x = 50; size_y = 50
  field = initfield(size_x, size_y);
  blocksize = Math.min(height / size_y, width / size_x);
}

function initfield(size_x, size_y) {
  console.log(size_y / 2);
  console.log(Math.round(size_y / 2))
  var field = [];
  for (x = 0; x < size_x; x++) {
    var column = [];
    for (y = 0; y < size_y; y++) {
      if (y != 0 && column[y - 1] == 1) {
      // first we check if there are any ground blocks above it
        column.push(1);
      } else if (x == 0 && y == Math.round(size_y / 2)) {
        // if that's not the case, we need to check if we're in the first column
        // and put a block at the middle height
        column.push(1);
      } else if (x != 0 && y < size_y - 2 && field[x - 1][y + 2] == 1
                 && Math.random() > 0.7) {
        // now we check if there's land at about the same height nearby
        column.push(1);
      } else if (y > size_y - 4 && Math.random() > 0.1) {
        // if it's at the bottom of the screen, roll for a random piece of land
        column.push(1);
      } else {
        // if it fails every check, it's air
        column.push(0);
      }
    }
    field.push(column);
  }
  return field;
}

function drawfield(field) {
  for (row = 0; row < field.length; row++) {
    for (block = 0; block < field[row].length; block++) {
      if (field[row][block] == 0) {
        fill(65, 200, 240);
      }

      else if (field[row][block] == 1) {
        fill(70, 40, 20);
      }
      rect(row * blocksize, block * blocksize, blocksize, blocksize);
    }
  }
}


function draw() {
  strokeWeight(0);
  drawfield(field);
}
