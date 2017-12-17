let size_x = 80;
let size_y = 50;
var blocksize;
var update_blocks = []; // blocks that need to be updated
var world;

function setup() {
  createCanvas(1400, 700);
  strokeWeight(0);
  bup = new Bup(1);
  blocksize = Math.min(height / size_y, width / size_x);
  world = new World();
  world.initfield(size_x, size_y);
  world.drawfield();
  spawning = 0;  // indicates whether we're currently spawning a new bup
  spawningdir = 1;
}



function draw() {
  world.update_field();
  bup.update();
}

function mousePressed() {
  bup.jump(0.5, -0.5);
}
