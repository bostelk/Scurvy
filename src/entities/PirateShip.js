var PirateShip = function(x, y) {
    this.name = WordSmith.getPirateName ();
    this.x = x;
    this.y = y;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.removeNextUpdate = false;
};

PirateShip.prototype.getDamage = function () {
    return Random.betweeni (1, 5);
};

PirateShip.prototype.loseHealth = function (amount) {
    this.health = Math.clamp (this.health - amount, 0, this.maxHealth);
    if (this.health <= 0) {
        this.removeNextUpdate = true;
        var voyage = G.voyages [G.voyages.length - 1];
        voyage["pirates_sunk"] += 1;
        G.log ("%c{purple}{0}%c{} sinks to the bottom of the ocean.".format (this.name));
    }
};

PirateShip.prototype.draw = function () {
    G.display.draw(this.x, this.y, "P", "red");
};
