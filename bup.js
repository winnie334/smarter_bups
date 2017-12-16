function Bup(team) {
  this.hasspawned = 0;
  this.spawndir = -2 * team + 1;
  this.pos = createVector(team * size_x, 1);
  this.vel = createVector();
  this.acc = createVector();
  this.gravity = createVector(0, 0.2);
  let precision = 10;

  this.spawnanimation = function() {
    this.pos.x += this.spawndir;
    if (this.pos.x < 0 || this.pos.x > size_x - 1) {
      this.pos.x -= this.spawndir;
      for (y = 0; y < size_y; y++) {
        if (field[this.pos.x][y] == 3 + team) {
          field[this.pos.x][y] = 0;
        }
      }
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
    } else {
      this.calculate();
      this.show();
    }
  }

  this.turn = function() {
    // doesn't actually turn. Rather, "it's his turn"
    // for now, it doesn't choose what it does yet
    this.jump(5, -3);
  }

  this.jump = function(x, y) {
    console.log("jump!")
    this.acc.add(x, y);
  }

  this.calculate = function() {
    // calculates new position
    curposx = Math.round(this.pos.x);
    curposy = Math.round(this.pos.y)
    field[curposx][curposy] = 0;
    if (field[curposx][curposy + 1] != 0 && this.vel.x == 0 && this.vel.y == 0
        && this.acc.x == 0 && this.acc.y == 0) {
          // if we are on the ground and don't have any velocity, we might as
          // well break to save on resources
          return;
        }
    this.acc.add(this.gravity);
    this.vel.add(this.acc);
    for (i = 0; i < precision; i++) {
      // let's try something hacky
      // instead of adding all the velocity and hoping we're not glitching
      // through, we add bit by bit and substract again if we collide
      this.pos.add(this.vel.x / precision, this.vel.y / precision);
      newposx = Math.round(this.pos.x);
      newposy = Math.round(this.pos.y);
      if (newposx < 0 || newposx >= size_x ||
          newposy < 0 || newposy >= size_y ||  // eh
          field[newposx][newposy] < 3 && field[newposx][newposy] != 0) {
        this.pos.sub(this.vel.x / precision, this.vel.y / precision);
        this.vel.mult(0); // we hit something, we lose all our velocity
        break;
      }
    }
    this.acc.mult(0);
  }

  this.show = function() {
    field[Math.round(this.pos.x)][Math.round(this.pos.y)] = 5 + team;
  }
}
