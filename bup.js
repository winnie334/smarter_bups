MAX_HP = 100;

function Bup(team, genome) {
  this.brain = genome;
  this.brain.score = 0;
  this.hasspawned = 0;
  this.spawndir = -2 * team + 1;
  this.color = (team ? "blue" : "red");
  this.hp = MAX_HP;
  this.rest = 0;
  this.pos = createVector(team * size_x, 1);
  this.vel = createVector();
  this.acc = createVector();
  this.gravity = createVector(0, 0.05);
  let precision = 10;

  this.spawnanimation = function() {
    this.pos.x += this.spawndir;
    if (this.pos.x < -this.spawndir || this.pos.x > size_x - 1 - this.spawndir) {
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

    var input = this.get_input();
    var output = this.brain.activate(input);
    output[1] -= 0.5;
    output[2] -= 0.5;

    if (Math.round(output[0])) {
      // this move is a projectile
      this.brain.score += 1;
      new Projectile(this.pos.x, this.pos.y, createVector(output[1], output[2]).normalize(), this.color);
    } else {
      // otherwise, we are jumping
      this.jump(createVector(output[1], output[2]).normalize());
    }
    this.cur += 1;
  }

  this.get_input = function() {
    // Returns a few input variables for our neat to work with.
    // For now, it returns the horizontal and vertical distance to the other bup.
    var otherBup = this.color == "red" ? population.bluebups[population.cur] : population.redbups[population.cur];
    var other_x = otherBup.pos.x / size_x;
    var other_y = otherBup.pos.y / size_y;
    var this_x = this.pos.x / size_x;
    var this_y = this.pos.y / size_y;
    var turn_counter = population.turns / MAX_TURNS;
    var this_hp = this.hp / MAX_HP;
    var other_hp = otherBup.hp / MAX_HP;
    return [this_x, this_y, other_x, other_y, turn_counter, this_hp, other_hp];
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
    if (!world.inbounds(curposx, curposy)) this.hp = 0;
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
        this.rest = 1;
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
    if (this.hp <= 0) {
      this.rest = 1;
    }
  }

}
