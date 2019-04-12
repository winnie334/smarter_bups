var neat;

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
  //initNeat();
  population = new Population(10);
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

function initNeat() {
  neat = new Neat(
    2, 2, null,
    { mutation: Methods.Mutation.ALL, //[Methods.Mutation.MOD_WEIGHT, Methods.Mutation.MOD_BIAS],
      popsize: PLAYER_AMOUNT,
      mutationRate: MUTATION_RATE,
      elitism: ELITISM_AMOUNT,
      network: new Architect.Random(
        2, START_HIDDEN_SIZE, 2
      )
    }
  )
}

function mousePressed() {
 fastmode = 1 - fastmode;
 world.drawfield();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
  world.drawfield(); // redraw, since not everything updates every frame
}
