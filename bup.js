function Bup(team, dna) {
  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA;
  }
  this.cur = 0; // what move we are currently doing (position in dna)
  this.hasspawned = 0;
  this.spawndir = -2 * team + 1;
  this.color = (team ? "blue" : "red");
  this.hp = 100;
  this.rest = 0;
  this.pos = createVector(team * size_x, 1);
  this.vel = createVector();
  this.acc = createVector();
  this.gravity = createVector(0, 0.05);
  let precision = 10;
  this.fitness = 0;

  this.spawnanimation = function() {
    this.pos.x += this.spawndir;
    if (this.pos.x < 0 || this.pos.x > size_x - 1) {
      this.pos.x -= this.spawndir;
      for (y = 0; y < size_y; y++) {
        if (world.field[this.pos.x][y] == 3 + team) {
          world.field[this.pos.x][y] = 0;
          update_blocks.push([this.pos.x, y]);
        }
      }
      this.hasspawned = 1;
    } else {
      for (y = 0; y < size_y; y++) {
        if (world.field[this.pos.x][y] == 0) {
          world.field[this.pos.x][y] = 3 + team;
          update_blocks.push([this.pos.x, y]);
        }

        if (this.pos.x > -1 && this.pos.x < size_x + this.spawndir) {
          if (world.field[this.pos.x - this.spawndir][y] == 3 + team) {
            world.field[this.pos.x - this.spawndir][y] = 0;
            update_blocks.push([this.pos.x - this.spawndir, y]);
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
    //new Projectile(this.pos.x, this.pos.y, createVector(1, 1))
    if (this.dna.genes[this.cur][0]) {
      // this move is a projectile
      new Projectile(this.pos.x, this.pos.y, this.dna.genes[this.cur][1]);
    } else {
      // otherwise, we are jumping
      this.jump(this.dna.genes[this.cur][1]);
    }
    this.cur += 1;
  }

  this.jump = function(direction) {
    this.acc.add(direction); // direction is a vector already
  }

  this.onground = function() {
    if (world.field[curposx][curposy + 1] == 1 ||
        world.field[curposx][curposy + 1] == 2) { // if we are on grass or ground
      return true;
    }
    return false;
  }

  this.calculate = function() {
    // calculates new position
    curposx = Math.round(this.pos.x);
    curposy = Math.round(this.pos.y);
    if (!world.inbounds(curposx, curposy) ||
       (this.onground() && this.vel.x == 0 && this.vel.y == 0
        && this.acc.x == 0 && this.acc.y == 0)) {
          // if we are on the ground and not moving, or we are out of the map,
          // we break to save some precious computer power
          this.rest = 1;
          return;
        }
    world.field[curposx][curposy] = 0;
    update_blocks.push([curposx, curposy]);
    // if we're past the not-moving check, it means... we are moving
    // therefore the field needs to be updated
    this.rest = 0;
    this.acc.add(this.gravity);
    this.vel.add(this.acc);
    for (var i = 0; i < precision; i++) {
      // let's try something hacky
      // instead of adding all the velocity and hoping we're not glitching
      // through, we add bit by bit and substract again if we collide
      this.pos.add(this.vel.x / precision, this.vel.y / precision);
      newposx = Math.round(this.pos.x);
      newposy = Math.round(this.pos.y);
      if (!world.inbounds(newposx, newposy)) {
            this.hp = 0;
            break;
      } else if (world.field[newposx][newposy] < 3 && world.field[newposx][newposy] != 0) {
        this.pos.sub(this.vel.x / precision, this.vel.y / precision);
        this.vel.mult(0); // we hit something, we lose all our velocity
        break;
      }
    }
    this.acc.mult(0);
  }

  this.show = function() {
    if (this.hp > 0) {
      world.field[Math.round(this.pos.x)][Math.round(this.pos.y)] = 5 + team;
      update_blocks.push([Math.round(this.pos.x), Math.round(this.pos.y)]);
    }
  }

  this.damage = function(damage) {
    // changes the hp (assumed positive for damage)
    this.hp -= damage;
  }

}
