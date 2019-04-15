function Explosion(x, y, size, owner) {
  this.pos = createVector(x, y);
  this.size = size;
  this.owner = owner;   // either "red" or "blue", depending by what projectile this explosion is caused.
  this.timer = 0; // counts how many frames we are exploding already
  world.projectile_list.push(this);

  this.update = function() {
    this.timer += 0.2;
    // we don't want to explode further every frame, this fixes that
    if (this.timer % 1 < 0.4) {this.explode()}
    if (this.timer > this.size) {
      world.projectile_list.splice(world.projectile_list.indexOf(this), 1);
    }
  }

  this.explode = function() {
    for (x = this.pos.x - size; x <= size + this.pos.x; x++) {
      for (y = this.pos.y - size; y <= size + this.pos.y; y++) {
        posx = this.pos.x - x;
        posy = this.pos.y - y;
        nx = Math.round(x);
        ny = Math.round(y);
        dis = Math.round(Math.sqrt(Math.pow(posx, 2) + Math.pow(posy, 2)));
        if (dis <= this.timer && world.inbounds(nx, ny - 1)) {
          if (this.timer >= this.size) {
            world.field[nx][ny] = 0;
          } else if (world.field[nx][ny] >= 0) {
            // if this spot isn't an explosion yet (value under 0), we make it -1
            // we need to check if it's a bup though
            
            if (world.field[nx][ny] == 5) {
              population.redbups[population.cur].damage(5);
              population.bupDamaged(this.owner, "red");
            } else if (world.field[nx][ny] == 6) {
              population.bluebups[population.cur].damage(5);
              population.bupDamaged(this.owner, "blue");
            }
            world.field[nx][ny] = -1;
          } else {
            world.field[nx][ny] -= 1;
          }
          update_blocks.push([nx, ny]);
        }
      }
    }
  }
}
