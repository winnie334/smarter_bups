var field = [];
let size_x = 80;
let size_y = 50;
var blocksize;
var update_blocks = []; // blocks that need to be updated

function setup() {
  createCanvas(1400, 700);
  strokeWeight(0);
  bup = new Bup(1);
  blocksize = Math.min(height / size_y, width / size_x);
  initfield(size_x, size_y);
  drawfield();
  spawning = 0;  // indicates whether we're currently spawning a new bup
  spawningdir = 1;
}

function initfield(size_x, size_y) {
  // makes a field [matrix] of numbers. Each number represents a type of block
  // 0 is air;
  // 1 is ground;
  // 2 is grass
  // 3 and 4 is red and blue beam
  // 5 and 6 is red and blue bup
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
    removepeaks();
    removecorners();
  }
  grassify();
}

function removecorners() {
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
}

function removepeaks() {
  // now let's remove those ugly "peaks"
  // the reason why we do this entire loop p times is to kill all peaks, not
  // just the ones of height 1
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

function grassify() {
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
}

function drawfield() {
  // converts the entire matrix into a terrain visible for humans
  for (column = 0; column < field.length; column++) {
    for (y = 0; y < field[column].length; y++) {
      update_block(column, y);
    }
  }
}

function update_block(x, y) {
  if (field[x][y] == 0) {
    fill(65, 200, 240);
  }
  else if (field[x][y] == 1) {
      fill(map(y, 0, size_y, 70, 20), map(y, 0, size_y, 40, 10), 10);
  }
  else if (field[x][y] == 2) {
    fill(25, 125, 25);
  }
  else if (field[x][y] == 3) {
    fill(240, 85, 100, 150);
  }
  else if (field[x][y] == 4) {
    fill(65, 111, 240, 500);
  }
  else if (field[x][y] == 5) {
    fill(240, 65, 80);
  }
  else if (field[x][y] == 6) {
    fill(65, 111, 240);
  }
  rect(x * blocksize, y * blocksize, blocksize, blocksize);
}

function update_field() {
  if (update_blocks.length > 0) {
    for (i = 0; i < update_blocks.length; i++) {
      update_block(update_blocks[i][0], update_blocks[i][1]);
    }
    update_blocks = [];
  }
}

function draw() {
  update_field();
  bup.update();
}

function mousePressed() {
  bup.jump(0.5, -0.5);
}
