function setup() {
  createCanvas(1400, 800);
  frameRate(5);
  size_x = 120; size_y = 60
  field = initfield(size_x, size_y);
  blocksize = Math.min(height / size_y, width / size_x);
}

function initfield(size_x, size_y) {
  // makes a field [matrix] of numbers. Each number represents a type of block
  // 0 is air;
  // 1 is ground;
  // 2 is grass
  var field = [];
  for (x = 0; x < size_x; x++) {
    var column = [];
    for (y = 0; y < size_y; y++) {
      if (y < 2) {
        // if we're at the top of the field, it should always be air
        column.push(0);
      } else if (column[y - 1] == 1) {
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
  for (i = 0; i < 5; i++) {
    field = removepeaks(field);
    field = removecorners(field);
  }
  field = grassify(field);
  return field;
}

function removecorners(field) {
  // let's remove those straight corners!
  for (x = 0; x < size_x; x++) {
    if (x != 0 && x != size_x - 1) {
      for (y = 0; y < size_y; y++) {
        if (y < size_y - 1 && y > 1 && field[x][y] == 1) {
          if (field[x + 1][y + 1] == 0 && field[x + 1][y] == 0
              && field[x][y - 1] == 0 && field[x - 1][y - 1] == 0) {
            field[x][y] = 0;
          } else if (field[x - 1][y + 1] == 0 && field[x - 1][y] == 0
              && field[x][y - 1] == 0 && field[x + 1][y - 1] == 0) {
            field[x][y] = 0;
          }
        }
      }
    }
  }
  return field;
}

function removepeaks(field) {
  // now let's remove those ugly "peaks"
  // the reason why we do this entire loop p times is to kill all peaks, not
  // just the ones of height 1
  for (p = 0; p < 2; p++) {
    for (x = 0; x < size_x; x++) {
      if (x != 0 && x != size_x - 1) {
        for (y = 0; y < size_y; y++) {
          if (y < size_y - 1 && field[x][y] == 1) {
            if (field[x - 1][y] == 0 && field[x + 1][y] == 0) {
              field[x][y] = 0;
            }
          }
        }
      }
    }
  }
  return field;
}

function grassify(field) {
  // converts certain ground pieces (1) to grass (2)
  for (column = 0; column < field.length; column++) {
    for (y = 0; y < field[column].length; y++) {
      if (field[column][y] == 1) {
        // Check whether it has an adjacent air block.
        if (y > 1 && field[column][y - 1] == 0) {
          field[column][y] = 2;
        } else if (column != 0 && field[column - 1][y] == 0) {
          field[column][y] = 2;
        } else if (column != size_x - 1 && field[column + 1][y] == 0) {
          field[column][y] = 2;
        }
      }
    }
  }
  return field;
}

function drawfield(field) {
  // converts the matrix into a terrain visible for humans
  for (column = 0; column < field.length; column++) {
    for (y = 0; y < field[column].length; y++) {
      if (field[column][y] == 0) {
        fill(65, 200, 240);
      }
      else if (field[column][y] == 1) {
          fill(map(y, 0, size_y, 70, 20), map(y, 0, size_y, 40, 10), 10);
        }
      else if (field[column][y] == 2) {
        fill(25, 125, 25);
      }
      rect(column * blocksize, y * blocksize, blocksize, blocksize);
    }
  }
}


function draw() {
  strokeWeight(0);
  drawfield(field);
}
