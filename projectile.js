function Projectile(startx, starty, acc) {
  this.pos = createVector(startx, starty);
  this.vel = createVector();
  this.acc = acc // already a vector
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
    world.field[Math.round(this.pos.x)][Math.round(this.pos.y)] = 0;
    update_blocks.push([Math.round(this.pos.x), Math.round(this.pos.y)]);

    this.acc.add(this.gravity);
    this.vel.add(this.acc);
    for (i = 0; i < precision; i++) {
      // let's try something hacky
      // instead of adding all the velocity and hoping we're not glitching
      // through, we add bit by bit and substract again if we collide
      this.pos.add(this.vel.x / precision, this.vel.y / precision);
      newposx = Math.round(this.pos.x);
      newposy = Math.round(this.pos.y);
      if (newposx < 0 || newposx >= size_x ||newposy < 0 || newposy >= size_y) {
          this.remove();
          this.pos.sub(this.vel.x / precision, this.vel.y / precision);
          break;
      } else if (world.field[newposx][newposy] != 0) {
        this.explode();
        break;
      }
    }
    this.acc.mult(0);
  }

  this.show = function() {
    world.field[Math.round(this.pos.x)][Math.round(this.pos.y)] = 7;
    update_blocks.push([Math.round(this.pos.x), Math.round(this.pos.y)]);
  }

  this.explode = function() {
    new Explosion(this.pos.x, this.pos.y, 5);
    this.remove();
  }

  this.remove = function() {
    // removes itself from the projectile list
    world.projectile_list.splice(world.projectile_list.indexOf(this), 1);
  }

}
