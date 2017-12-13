function setup() {
  createCanvas(1000, 800);
  frameRate(10);
  field = initfield(50, 50);
  blocksize = 25;
}

function initfield(size_x, size_y) {
  var field = [];
  for (x = 0; x < size_x; x++) {
    var column = [];
    for (y = 0; y < size_y; y++) {
      if (y != 0 && column[y - 1] == 1 || Math.random() > 0.99
          || (x != 0 && field[x - 1][y] == 1 && Math.random() > 0.5)) {
        column.push(1);
      } else {
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
        stroke(65, 200, 240);
      }

      else if (field[row][block] == 1) {
        fill(200, 200, 100);
        stroke(200, 200, 100);
      }
      rect(row * blocksize, block * blocksize, blocksize, blocksize);
    }
  }
}


function draw() {
  fill(50, 25, 230);
  drawfield(field);
}
