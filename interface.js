// Draws all kinds of useful information on screen.

background_color = [167, 191, 232];
red_color = [200, 20, 20];
blue_color = [51, 94, 214];

function drawInterface() {
    push();
    translate(0, 720)
    drawCadre();
    drawHealth();
    drawTurn();
    pop();
}

function drawCadre() {
    // A nice rectangle around the entirety of the interface.
    fill(background_color);
    stroke(20, 20, 20);
    strokeWeight(4);
    rect(1, 1, width-1, height-720-1);
}

function drawHealth() {
    // Draws a healthbar for each bup on top of the interface.
    strokeWeight(1);

    var hp = population.bluebups[population.cur].hp;
    fill(background_color);
    rect(10, 10, 100, 30);
    fill(red_color);
    rect(10, 10, hp, 30);

    var hp = population.redbups[population.cur].hp;
    fill(background_color);
    rect(width-110, 10, 100, 30);
    fill(blue_color);
    rect(width-110+100-hp, 10, hp, 30);
}

function drawTurn() {
    // Draws something to indicate the current turn.
    rectMode(CENTER);
    strokeWeight(3);
    fill(0);
    rect(width/2, 0, 40, 40);

    strokeWeight(1);
    fill(population.redblue ? red_color : blue_color);
    rect(width/2, 0, 37, 37);

    fill(0);
    textSize(25);
    text(population.turns, width/2-textWidth(population.turns)/2, 10);

    rectMode(CORNER);
}