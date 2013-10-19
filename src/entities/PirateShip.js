var PirateShip = function(x, y) {
    this.x = x;
    this.y = y;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.removeNextUpdate = false;
};

PirateShip.prototype.getDamage = function () {
    return Random.betweeni (1, 5);
};

PirateShip.prototype.takeDamage = function (amount) {
    this.health -= amount;
    if (this.health <= 0)
        this.removeNextUpdate = true;
};

PirateShip.prototype.draw = function () {
    G.display.draw(this.x, this.y, "P", "red");
};
