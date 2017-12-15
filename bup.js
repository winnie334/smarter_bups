function Bup(team) {
  this.hasspawned = 0;
  this.spawndir = -2 * team + 1;
  this.pos = createVector(team * size_x, 1);

  this.spawnanimation = function() {
    this.pos.x += this.spawndir;
    if (this.pos.x < 0 || this.pos.x > size_x - 1) {
      this.hasspawned = 1;
    } else {
      for (y = 0; y < size_y; y++) {
        if (field[this.pos.x][y] == 0) {
          field[this.pos.x][y] = 3 + team;
        }

        if (this.pos.x > -1 && this.pos.x < size_x + this.spawndir) {
          if (field[this.pos.x - this.spawndir][y] == 3 + team) {
            field[this.pos.x - this.spawndir][y] = 0;
          }
        }
      }
    }
  }

  this.update = function() {
    if (!this.hasspawned) {
      this.spawnanimation();
    }
  }
}
