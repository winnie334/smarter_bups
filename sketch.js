let size_x = 100;
let size_y = 60;
var blocksize;
var update_blocks = []; // blocks that need to be updated
var world;

function setup() {
  createCanvas(1200, 900);
  noStroke();
  blocksize = Math.min(height / size_y, width / size_x);
  world = new World();
  world.initfield(size_x, size_y);
  world.drawfield();
  bup1 = new Bup(1);
  bup2 = new Bup(0);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  bup1.update();
  bup2.update();
 for (let projectile of world.projectile_list) {
    projectile.update();
  }
  world.update_field();
}

function mousePressed() {
  new Projectile(bup1.pos.x + 1, bup1.pos.y - 1, createVector(0.5, -0.5));
  bup1.jump(0.5, -0.7);
  bup2.jump(-0.5, -0.7);
}
