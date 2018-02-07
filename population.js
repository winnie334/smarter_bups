function Population(size) {
  this.generation = 1; // current generation, increases after a full run
  this.redbups = [];
  this.bluebups = [];
  this.size = size; // how many bups are in each team
  this.cur = 0; // what pair we are currently running
  this.redblue = 0; // 0 if currently red, 1 if currently blue
  this.done = 0;

  for (i = 0; i < this.size; i++) {
    this.redbups[i] = new Bup(0);
    this.bluebups[i] = new Bup(1);
  }

  this.run = function() {
    // if nothing is happening, let a bup do something
    if (!this.redblue && this.bluebups[this.cur].rest && world.quiet()) {
      // if it's red's turn, and blue is currently not moving
          this.redbups[this.cur].turn();
          this.redblue = 1;
    } else if (this.redblue && this.redbups[this.cur].rest && world.quiet()) {
          this.bluebups[this.cur].turn();
          this.redblue = 0;
    }
    if (this.redbups[this.cur].hp <= 0 || this.bluebups[this.cur].hp <= 0) {
      // if one of the bups is dead, move on to the next pair or population
      this.cur += 1;
      if (this.cur >= this.size) {
        this.done = 1;
      }
    }
  }

  this.evaluate = function() {
    this.maxfit = [0, 0];
    for (i = 0; i < this.size; i++) {
      this.redbups[i].fitness = this.redbups[i].hp - this.bluebups[i].hp + 100;
      this.bluebups[i].fitness = this.bluebups[i].hp - this.redbups[i].hp + 100;
      if (this.redbups[i].fitness > this.maxfit[0]) {
        this.maxfit[0] = this.redbups[i].fitness;
      }
      if (this.bluebups[i].fitness > this.maxfit[1]) {
        this.maxfit[1] = this.bluebups[i].fitness;
      }
    }
    for (i = 0; i < this.size; i++) {
      this.redbups[i].fitness /= this.maxfit[0];
      this.bluebups[i].fitness /= this.maxfit[1];
    }
    // now let's make 2 matingpools, one for each team
    this.matingpool = [[], []];
    for (var i = 0; i < this.size; i++) {
      // we loop through all the bups, and add a bup as many times as it has
      // fitness. So more fitness means more appearances in the matingpool
      n = this.redbups[i].fitness *= 100;
      for (q = 0; q < n; q++) {
        this.matingpool[0].push(this.redbups[i]);
      }
      n = this.bluebups[i].fitness *= 100;
      for (q = 0; q < n; q++) {
        this.matingpool[1].push(this.bluebups[i]);
      }
    }
  }
}
