PLAYER_AMOUNT = 10;
MUTATION_RATE = 0.3;
ELITISM_AMOUNT = 2;
START_HIDDEN_SIZE = 2;

MAX_TURNS = 30;

var Neat    = neataptic.Neat;
var Methods = neataptic.Methods;
var Config  = neataptic.Config;
var Architect = neataptic.Architect;


function initNeat() {
    var neatRed = new Neat(
        7, 3, null, {
            mutation: Methods.Mutation.ALL,
            popsize: PLAYER_AMOUNT,
            mutationRate: MUTATION_RATE,
            elitism: ELITISM_AMOUNT,
            network: new Architect.Random(
                7, START_HIDDEN_SIZE, 3
            )
        }
    )

    var neatBlue = new Neat(
        7, 3, null, {
            mutation: Methods.Mutation.ALL,
            popsize: PLAYER_AMOUNT,
            mutationRate: MUTATION_RATE,
            elitism: ELITISM_AMOUNT,
            network: new Architect.Random(
                7, START_HIDDEN_SIZE, 3
            )
        }
    )

    neats = [neatRed, neatBlue];
    neats[0].team = "red";
    neats[1].team = "blue";
}

function startEvaluation() {
    newReds = [];
    newBlues = [];
    for (var i = 0; i < neats[0].population.length; i++) {
        newReds.push(new Bup(0, neats[0].population[i]))
    }

    for (var i = 0; i < neats[1].population.length; i++) {
        newBlues.push(new Bup(1, neats[1].population[i]))
    }

    population.redbups = newReds;
    population.bluebups = newBlues;
}

function endEvaluation() {
    console.log("Generation " + neats[0].generation + " done!");
    for (var i = 0; i < 2; i++) {  // We first handle the red neat, then the blue neat
        var output = "[" + neats[i].team + "]: ";
        output += "Average score: " + Math.round(neats[i].getAverage(), 1) + "\t";
        output += "Best: " + Math.round(neats[i].getFittest().score, 1);
        console.log(output);

        neats[i].sort();

        var newPopulation = [];

        for (let genome of neats[i].population) {
            genome.score -= genome.nodes.length / 100;
        }

        for (var j = 0; j < ELITISM_AMOUNT; j++) { // Gets best bups and transfers
            newPopulation.push(neats[i].population[j]); // them to next generation
        }

        for (var j = 0; j < PLAYER_AMOUNT - ELITISM_AMOUNT; j++) {
            newPopulation.push(neats[i].getOffspring());
        }

        neats[i].population = newPopulation;
        neats[i].mutate();
        neats[i].generation++;
    }
    startEvaluation();
}

function run_evolution() {
    if (check_end()) return;
    for (let bup of bups) {
        bup.update();
        if (!fastmode) bup.show();
    }
}

function check_end() {
    finished = true;
    for (let bup of bups) {
        if (bup.status == 0) finished = false; // A block is still moving
    }
    if (finished) {
        endEvaluation();
        return true;
    }
    return false;
}