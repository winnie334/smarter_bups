function Population(size) {
  this.generation = 1; // current generation, increases after a full run
  this.redbups = [];
  this.bluebups = [];
  this.size = size; // how many bups are in each team
  this.cur = 0; // what pair we are currently running
  this.redblue = 0; // 0 if currently red, 1 if currently blue
  this.done = 0; // a pair is completely evaluated
  this.fulldone = 0; // an entire generation is evaluated
  for (var i = 0; i < this.size; i++) {
    this.redbups.push(new Bup(0));
    this.bluebups.push(new Bup(1));
  }

  this.next = function() {
    // small help function to go to the next pair of bups
    this.cur += 1;
    this.redblue = 0;
    this.done = 1;
    if (this.cur >= this.size) {
      this.fulldone = 1;
    }
  }


  this.run = function() {
    // a "tick" of the world
    maxturns = this.redbups[0].dna.maxturns
    if ((this.redbups[this.cur].cur >= maxturns ||
         this.redbups[this.cur].cur >= maxturns) && world.quiet()) {
      // if one of the bups is dead, move on to the next pair or population
      console.log("A bup survived till the end!");
      this.next();
    }
    else if (this.redbups[this.cur].hp <= 0 && this.bluebups[this.cur].hp <= 0) {
      var last = max(this.redbups[this.cur].cur, this.bluebups[this.cur].cur);
      console.log("both bups died on turn " + last);
      this.next();
    }
    // if nothing is happening or the other bup is dead, do something
    else if ((!this.redblue || this.bluebups[this.cur].hp <= 0) && world.quiet()) {
      // if it's red's turn, and blue is currently not moving
      this.redbups[this.cur].turn();
      this.redblue = (this.bluebups[this.cur].hp > 0);
      // only switch if the other bup is still alive
    }
    else if ((this.redblue || this.bluebups[this.cur].hp <= 0) && world.quiet()) {
      this.bluebups[this.cur].turn();
      this.redblue = (this.redbups[this.cur].hp <= 0);
    }

  }

  this.evaluate = function() {
    // gives each bup a "score", which is then used as a chance to be in the
    // next generation. The higher your score, the better the odds
    this.maxfit = [0, 0];
    for (var i = 0; i < this.size; i++) {
      // the fitness is their health compared to the other's health
      // 100 is added to ensure there's no negative numbers
      // this.redbups[i].fitness = this.redbups[i].hp - this.bluebups[i].hp + 101;
      // this.bluebups[i].fitness = this.bluebups[i].hp - this.redbups[i].hp + 101;
      this.redbups[i].fitness += Math.pow(this.redbups[i].cur, 3); // surviving longer is better
      this.bluebups[i].fitness += Math.pow(this.bluebups[i].cur, 3);
      if (this.redbups[i].fitness > this.maxfit[0]) {
        this.maxfit[0] = this.redbups[i].fitness;
      }
      if (this.bluebups[i].fitness > this.maxfit[1]) {
        this.maxfit[1] = this.bluebups[i].fitness;
      }
    }
    // for (var i = 0; i < this.redbups.length; i++) {
    //     this.redbups[i].fitness /= this.maxfit[0];
    //     this.bluebups[i].fitness /= this.maxfit[1];
    // }
    console.log("red maxfit: " + this.maxfit[0]);
    console.log("blue maxfit: " + this.maxfit[1]);
    // now let's make 2 matingpools, one for each team
    this.matingpool = [[], []];
    for (var i = 0; i < this.size; i++) {
      // we loop through all the bups, and add a bup as many times as it has
      // fitness. So more fitness means more appearances in the matingpool
      for (var q = 0; q < this.redbups[i].fitness * 100; q++) {
        this.matingpool[0].push(this.redbups[i]);
      }
      for (var q = 0; q < this.bluebups[i].fitness * 100; q++) {
        this.matingpool[1].push(this.bluebups[i]);
      }
    }
    console.log("matingpool")
    console.log(this.matingpool[0])
  }

  this.selection = function() {
    // makes a new population, based on the previous one
    var redlings = []
    for (var i = 0; i < this.redbups.length; i++) {
      var parentA = random(this.matingpool[0]).dna;
      var parentB = random(this.matingpool[0]).dna;
      var child = parentA.crossover(parentB);
      child.mutate();
      redlings.push(new Bup(0, child));
    }
    this.redbups = redlings.slice();

    var bluelings = []
    for (var i = 0; i < this.bluebups.length; i++) {
      var parentA = random(this.matingpool[1]).dna;
      var parentB = random(this.matingpool[1]).dna;
      var child = parentA.crossover(parentB);
      child.mutate();
      bluelings.push(new Bup(1, child));
    }
    this.bluebups = bluelings.slice();
    console.log("new redlings")
    console.log(this.redbups)
  }

  this.check = function() {
    // looks for potential "dones", meaning a pair or a generation is finished
    if (!this.done) {
      if (this.redbups[this.cur].hp > 0) {
        this.redbups[this.cur].update();
      }
      if (this.bluebups[this.cur].hp > 0) {
        this.bluebups[this.cur].update();
      }
    } else {
      // a pair has been evaluated, we need to reset the world
      world.restore();
      this.done = 0;
      if (this.fulldone) {
        // the entire generation has been evaluated, we need to make a new one
        this.evaluate();
        this.selection()
        this.generation += 1;
        console.log("generation: " + this.generation)
        this.fulldone = 0;
        this.cur = 0;
      }
    }
  }

}
