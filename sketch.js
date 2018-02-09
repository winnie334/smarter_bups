let size_x = 100;
let size_y = 60;
var blocksize;
var update_blocks = []; // blocks that need to be updated
var world;
var population;

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
 population.run();
 if (!population.done) {
   population.redbups[population.cur].update();
   population.bluebups[population.cur].update();
 } else {
   // a pair has been evaluated, we need to reset the world
   world.restore();
   population.done = 0;
   if (population.fulldone) {
     // the entire generation has been evaluated, we need to make a new one
     population.evaluate();
     population.selection();
     population.fulldone = 0;
   }
 }

 for (let projectile of world.projectile_list) {
    projectile.update();
  }
  world.update_field();
}

function mousePressed() {

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
  world.drawfield(); // redraw, since not everything updates every frame
}
