function Projectile(startx, starty, direction, owner) {
  this.pos = createVector(startx, starty);
  this.vel = createVector();
  this.acc = direction;
  this.owner = owner;   // Either "red" or "blue", depending on who shot this projectile.
  this.gravity = createVector(0, 0.02);
  let precision = 20;
  world.projectile_list.push(this);

  this.update = function() {
    this.calculate();
    this.show();
  }

  this.calculate = function() {
    // calculates new position
    // first we remove ourselves
    if (world.inbounds(Math.round(this.pos.x), Math.round(this.pos.y))) {
      world.field[Math.round(this.pos.x)][Math.round(this.pos.y)] = 0;
      update_blocks.push([Math.round(this.pos.x), Math.round(this.pos.y)]);
    } else {
      this.remove();
    }

    this.acc.add(this.gravity);
    this.vel.add(this.acc);
    for (var i = 0; i < precision; i++) {
      // let's try something hacky
      // instead of adding all the velocity and hoping we're not glitching
      // through, we add bit by bit and substract again if w collide
      this.pos.add(this.vel.x / precision, this.vel.y / precision);
      newposx = Math.round(this.pos.x);
      newposy = Math.round(this.pos.y);
      if (!world.inbounds(newposx, newposy)) {
        // we hit the sides, we need to remove ourselves
        //this.pos.sub(this.vel.x / precision, this.vel.y / precision);
        this.explode();
        break;
      } else if (world.field[newposx][newposy] != 0) {
        this.explode();
        break;
      }
    }
    this.acc.mult(0);
  }

  this.show = function() {
    if (world.inbounds(Math.round(this.pos.x), Math.round(this.pos.y))) {
      world.field[Math.round(this.pos.x)][Math.round(this.pos.y)] = 7;
      update_blocks.push([Math.round(this.pos.x), Math.round(this.pos.y)]);
    }
  }

  this.explode = function() {
    new Explosion(this.pos.x, this.pos.y, 5, this.owner);
    this.remove();
  }

  this.remove = function() {
    // removes itself from the projectile list
    world.projectile_list.splice(world.projectile_list.indexOf(this), 1);
  }

}
