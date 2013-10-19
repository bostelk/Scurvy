var PirateShip = function() {
    this.maxHealth = 100;
    this.health = this.maxHealth;
};

PirateShip.prototype.getDamage = function () {
    return Random.betweeni (1, 5);
};
