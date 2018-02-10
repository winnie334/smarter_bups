function DNA(genes) {
  // A dna object will basically list all the moves the bup will do
  // it is a list of lists, with each sublist giving info over one move
  // a move can either be a jump or a projectile, this will be shown as 0 or 1
  // both need a "direction", these will be the second and third values

  this.maxturns = 20; // max amount of turns one dna object stores
  this.mag = 1; // the max magnetude of a move, higher means more power per bup
  this.mutationrate = 0.05;

  if (genes) {
    this.genes = genes; // if we've been given genes, we use that
  } else {
    this.genes = []; // otherwise, we make completely random genes
    for (var i = 0; i < this.maxturns; i++) {
      var move = [];
      move[0] = ((Math.random() > 0.5) ? 0 : 1);
      move[1] = p5.Vector.random2D().setMag(this.mag);
      // move is a list of 2 elements, one being a boolean, the other a vector
      this.genes[i] = move;
    }
  }

  // this.crossover = function(partner) {
  //   // mixes the genes of this dna and the partner's
  //   // basically, each move of the new genes is either from parent A or B
  //   newgenes = [];
  //   for (var i = 0; i < this.maxturns; i++) {
  //     if (Math.random() > 0.5) {
  //       newgenes[i] = this.genes[i];
  //     } else {
  //       newgenes[i] = partner.genes[i];
  //     }
  //   }
  //   return new DNA(newgenes);
  // }

  this.crossover = function(partner) {
    var newgenes = [];
    var mid = floor(random(this.genes.length))
    for (var i = 0; i < this.genes.length; i++) {
      if (i > mid) {
        newgenes[i] = this.genes[i];
      } else {
        newgenes[i] = partner.genes[i];
      }
    }
    return new DNA(newgenes);
  }

  this.mutate = function() {
    // randomly changes the genes a bit, to allow new strategies
    // more likely it completely ruins the bup but who knows
    for (var i = 0; i < this.maxturns; i++) {
      if (Math.random() < this.mutationrate) {
        // we will be altering this move
        if (Math.random() < this.mutationrate * 2) {
          // very rarely, a jump becomes a projectile or the other way around
          this.genes[i][0] = 1 - this.genes[i][0];
        } // regardless, we will be changing the vector
        this.genes[i][1] = p5.Vector.random2D().setMag(this.mag);
      }
    }
  }

}
