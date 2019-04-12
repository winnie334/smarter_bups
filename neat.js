PLAYER_AMOUNT = 20;
MUTATION_RATE = 0.3;
ELITISM_AMOUNT = 2;
START_HIDDEN_SIZE = 2;

START_X = 0;
START_Y = 200;

var Neat    = neataptic.Neat;
var Methods = neataptic.Methods;
var Config  = neataptic.Config;
var Architect = neataptic.Architect;



function initNeat() {
    neat = new Neat(
        2, 2, null, {
            mutation: Methods.Mutation.ALL, //[Methods.Mutation.MOD_WEIGHT, Methods.Mutation.MOD_BIAS],
            popsize: PLAYER_AMOUNT,
            mutationRate: MUTATION_RATE,
            elitism: ELITISM_AMOUNT,
            network: new Architect.Random(
                2, START_HIDDEN_SIZE, 2
            )
        }
    )
}

function startEvaluation() {
    blocks = [];

    for (let genome of neat.population) {
        new bup(genome);
    }
    terrain = generate_terrain();
}

function endEvaluation() {
    var output = "Generation " + neat.generation + " done! \t\t";
    output += "average score: " + neat.getAverage() + "\t\t";
    output += "Best: " + neat.getFittest().score;
    if (!fastmode || neat.generation % 5 == 0) console.log(output);

    neat.sort();

    var newPopulation = [];

    for (let genome of neat.population) {
        genome.score -= genome.nodes.length / 200;
    }

    for (var i = 0; i < ELITISM_AMOUNT; i++) { // Gets best bups and transfers
        newPopulation.push(neat.population[i]); // them to next generation
    }

    for (var i = 0; i < PLAYER_AMOUNT - ELITISM_AMOUNT; i++) {
        newPopulation.push(neat.getOffspring());
    }

    neat.population = newPopulation;
    neat.mutate();
    neat.generation++;
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