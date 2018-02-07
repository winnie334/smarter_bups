function Explosion(x, y, size) {
  this.pos = createVector(x, y);
  this.size = size;
  this.timer = 0; // counts how many frames we are exploding already
  world.projectile_list.push(this);

  this.update = function() {
    this.timer += 1 / this.size;
    this.explode();
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
          }
          else if (world.field[nx][ny] >= 0) {
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
