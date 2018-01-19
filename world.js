function World() {
  this.field = [];
  this.projectile_list = []; // list of all projectiles currently flying

  this.initfield = function(size_x, size_y) {
    // makes a field [matrix] of numbers. Each number represents a type of block
    // 0 is air;
    // 1 is ground;
    // 2 is grass
    // 3 and 4 is red and blue beam
    // 5 and 6 is red and blue bup
    // 7 is a projectile
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
        } else if (x != 0 && y < size_y - 2 && this.field[x - 1][y + 2] == 1
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
      this.field.push(column);
    }
    for (i = 0; i < 5; i++) {
      this.removepeaks();
      this.removecorners();
    }
    this.grassify();
  }

  this.removecorners = function() {
    // let's remove those straight corners!
    for (x = 0; x < size_x; x++) {
      if (x != 0 && x != size_x - 1) {
        for (y = 0; y < size_y; y++) {
          if (y < size_y - 1 && y > 1 && this.field[x][y] == 1) {
            if (this.field[x + 1][y + 1] == 0 && this.field[x + 1][y] == 0
                && this.field[x][y - 1] == 0 && this.field[x - 1][y - 1] == 0) {
              this.field[x][y] = 0;
            } else if (this.field[x - 1][y + 1] == 0 && this.field[x - 1][y] == 0
                && this.field[x][y - 1] == 0 && this.field[x + 1][y - 1] == 0) {
              this.field[x][y] = 0;
            }
          }
        }
      }
    }
  }

  this.removepeaks = function() {
    // now let's remove those ugly "peaks"
    // the reason why we do this entire loop p times is to kill all peaks, not
    // just the ones of height 1
    for (x = 0; x < size_x; x++) {
      if (x != 0 && x != size_x - 1) {
        for (y = 0; y < size_y; y++) {
          if (y < size_y - 1 && this.field[x][y] == 1) {
            if (this.field[x - 1][y] == 0 && this.field[x + 1][y] == 0) {
              this.field[x][y] = 0;
            }
          }
        }
      }
    }
  }

  this.grassify = function() {
    // converts certain ground pieces (1) to grass (2)
    for (column = 0; column < this.field.length; column++) {
      for (y = 0; y < this.field[column].length; y++) {
        if (this.field[column][y] == 1) {
          // Check whether it has an adjacent air block.
          if (y > 1 && this.field[column][y - 1] == 0) {
            this.field[column][y] = 2;
          } else if (column != 0 && this.field[column - 1][y] == 0) {
            this.field[column][y] = 2;
          } else if (column != size_x - 1 && this.field[column + 1][y] == 0) {
            this.field[column][y] = 2;
          }
        }
      }
    }
  }

  this.drawfield = function() {
    // converts the entire matrix into a terrain visible for humans
    for (column = 0; column < this.field.length; column++) {
      for (y = 0; y < this.field[column].length; y++) {
        this.update_block(column, y);
      }
    }
  }

  this.update_block = function(x, y) {
    if (this.field[x][y] == 0) {
      // air
      fill(65, 200, 240);
    }
    else if (this.field[x][y] == 1) {
      // ground
        fill(map(y, 0, size_y, 70, 20), map(y, 0, size_y, 40, 10), 10);
    }
    else if (this.field[x][y] == 2) {
      // grass
      fill(25, 125, 25);
    }
    else if (this.field[x][y] == 3) {
      // red spawn beam
      fill(200, 20, 20, 150);
    }
    else if (this.field[x][y] == 4) {
      // blue spawn beam
      fill(65, 111, 240, 500);
    }
    else if (this.field[x][y] == 5) {
      // red bup
      fill(200, 20, 20);
    }
    else if (this.field[x][y] == 6) {
      // blue bup
      fill(65, 111, 240);
    }
    else if (this.field[x][y] == 7) {
      // projectile
      fill(250, 160, 70);
    }
    rect(x * blocksize, y * blocksize, blocksize, blocksize);
  }

  this.update_field = function() {
    if (update_blocks.length > 0) {
      for (i = 0; i < update_blocks.length; i++) {
        this.update_block(update_blocks[i][0], update_blocks[i][1]);
      }
      update_blocks = [];
    }
  }
}
