let size_x = 100;
let size_y = 60;
var blocksize;
var update_blocks = []; // blocks that need to be updated
var world;
var population;
var fastmode = 0;

function setup() {
  createCanvas(1200, 900);
  noStroke();
  blocksize = Math.min(height / size_y, width / size_x);
  world = new World();
  world.initfield(size_x, size_y);
  world.drawfield();
  world.backup(); // we save this map, so we can recover it at any time
  population = new Population(5);
}

function draw() {
 for (var i = 0; i < fastmode * 150 + 1; i++) {
   population.run();
   population.check();
   for (let projectile of world.projectile_list) {
      projectile.update();
    }
  }
  world.update_field();
}

function mousePressed() {
 fastmode = 1 - fastmode;
 world.drawfield();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
  world.drawfield(); // redraw, since not everything updates every frame
}
