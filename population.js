function Population() {
  this.redbups = [];
  this.bluebups = [];
  this.cur = 0; // what pair we are currently running
  this.turns = 0; // how many turns the current pair already had
  this.redblue = 0; // 0 if currently red, 1 if currently blue
  this.done = 0; // a pair is completely evaluated
  this.fulldone = 0; // an entire generation is evaluated

  this.next = function() {
    // small help function to go to the next pair of bups

    // first we give a score to the bups that just finished
    this.redbups[this.cur].brain.score = this.redbups[this.cur].hp - this.bluebups[this.cur].hp + this.cur * 5;
    this.bluebups[this.cur].brain.score = this.bluebups[this.cur].hp - this.redbups[this.cur].hp + this.cur * 5;

    // then we upate all variables for the next pair
    this.cur += 1;
    console.log("evaluating pair ", this.cur)
    this.redblue = 0;
    this.turns = 0;
    this.done = 1;
    if (this.cur >= this.redbups.length) {
      this.fulldone = 1;
    }
  }

  this.run = function() {
    // a "tick" of the world
    if (!world.quiet()) return;
    if ((this.turns >= MAX_TURNS)) {
      // if one of the bups is dead, move on to the next pair or population
      console.log("max turns reached")
      this.next();
    } else if (this.redbups[this.cur].hp <= 0 || this.bluebups[this.cur].hp <= 0) {
      console.log("one of the bups died")
      this.next();
    }
    // if nothing is happening or the other bup is dead, do something
    else if ((!this.redblue)) {
      // if it's red's turn, and blue is currently not moving
      this.redbups[this.cur].turn();
      this.redblue = (this.bluebups[this.cur].hp > 0);
      this.turns += 1;
      // only switch if the other bup is still alive
    }
    else if ((this.redblue)) {
      this.bluebups[this.cur].turn();
      this.redblue = (this.redbups[this.cur].hp <= 0);
      this.turns += 1;
    }

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
        endEvaluation();
        this.fulldone = 0;
        this.cur = 0;
      }
    }
  }

}
